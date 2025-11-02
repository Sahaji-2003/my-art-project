// ============================================
// src/pages/UploadPage.tsx
// ============================================
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { artworkAPI, artworkValidation, type CreateArtworkData, type Artwork } from '../services/artwork';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../styles/App.css';

const UploadPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editArtworkId = searchParams.get('edit');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    medium: '',
    style: '',
    dimensions: {
      width: '',
      height: '',
      depth: '',
      unit: 'cm'
    },
    tags: ''
  });
  
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingArtwork, setEditingArtwork] = useState<Artwork | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('dimensions.')) {
      const dimensionField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        dimensions: {
          ...prev.dimensions,
          [dimensionField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
  };

  const handleFiles = (files: File[]) => {
    // Only take the first file
    const file = files[0];
    if (!file) return;

      const isValidType = file.type.startsWith('image/');
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB limit

    if (!isValidType || !isValidSize) {
      setErrors(prev => ({
        ...prev,
        files: 'Please select a valid image file (max 10MB)'
      }));
      return;
    }

    setSelectedFiles([file]);
    
    // Create preview URL
    const newPreviewUrl = URL.createObjectURL(file);
    setPreviewUrls([newPreviewUrl]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const removeFile = () => {
    if (previewUrls[0]) {
      URL.revokeObjectURL(previewUrls[0]);
    }
    setSelectedFiles([]);
    setPreviewUrls([]);
  };

  // Fetch artwork data when in edit mode
  useEffect(() => {
    const fetchArtworkForEdit = async () => {
      if (editArtworkId) {
        setIsEditMode(true);
        setLoading(true);
        try {
          const response = await artworkAPI.getArtwork(editArtworkId);
          const artwork = response.data;
          setEditingArtwork(artwork);
          
          // Populate form with existing artwork data
          setFormData({
            title: artwork.title || '',
            description: artwork.description || '',
            price: artwork.price?.toString() || '',
            medium: artwork.medium || '',
            style: artwork.style || '',
            dimensions: {
              width: artwork.dimensions?.width?.toString() || '',
              height: artwork.dimensions?.height?.toString() || '',
              depth: artwork.dimensions?.depth?.toString() || '',
              unit: artwork.dimensions?.unit || 'cm'
            },
            tags: artwork.tags?.join(', ') || ''
          });
          
          // Set preview URLs from existing images
          if (artwork.images && artwork.images.length > 0) {
            setPreviewUrls([artwork.images[0].url]);
          }
        } catch (err: any) {
          console.error('Error fetching artwork for edit:', err);
          setErrors({ general: 'Failed to load artwork. Please try again.' });
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchArtworkForEdit();
  }, [editArtworkId]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    // Validate title
    const titleValidation = artworkValidation.validateTitle(formData.title);
    if (!titleValidation.isValid) {
      newErrors.title = titleValidation.message || 'Title is required';
    }

    // Validate description
    const descriptionValidation = artworkValidation.validateDescription(formData.description);
    if (!descriptionValidation.isValid) {
      newErrors.description = descriptionValidation.message || 'Description is required';
    }

    // Validate price
    const priceValidation = artworkValidation.validatePrice(parseFloat(formData.price) || 0);
    if (!priceValidation.isValid) {
      newErrors.price = priceValidation.message || 'Please enter a valid price';
    }

    // Validate medium
    const mediumValidation = artworkValidation.validateMedium(formData.medium);
    if (!mediumValidation.isValid) {
      newErrors.medium = mediumValidation.message || 'Medium is required';
    }

    // Validate style
    const styleValidation = artworkValidation.validateStyle(formData.style);
    if (!styleValidation.isValid) {
      newErrors.style = styleValidation.message || 'Style is required';
    }

    // Validate images
    const imagesValidation = artworkValidation.validateImages(selectedFiles);
    if (!imagesValidation.isValid && !(isEditMode && editingArtwork?.images && editingArtwork.images.length > 0)) {
      newErrors.files = imagesValidation.message || 'Please select at least one image';
    }

    // Validate tags
    const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    const tagsValidation = artworkValidation.validateTags(tagsArray);
    if (!tagsValidation.isValid) {
      newErrors.tags = tagsValidation.message || 'Invalid tags';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      // Upload images first (only if new files are selected)
      let uploadedImages: Array<{ url: string; isPrimary: boolean }> = [];
      
      if (selectedFiles.length > 0) {
        uploadedImages = await Promise.all(
        selectedFiles.map(async (file, index) => {
          try {
              const uploadResponse = await artworkAPI.uploadImage(file);
            return {
              url: uploadResponse.data.url,
              isPrimary: index === 0
            };
          } catch (uploadError) {
            console.warn('Image upload failed, using placeholder:', uploadError);
            // Fallback to placeholder if upload fails
            return {
              url: `https://via.placeholder.com/800x600/4A90E2/FFFFFF?text=Image+${index + 1}`,
              isPrimary: index === 0
            };
          }
        })
      );
      } else if (isEditMode && editingArtwork?.images && editingArtwork.images.length > 0) {
        // Keep existing images if no new files are selected
        uploadedImages = editingArtwork.images;
      }

      // Prepare artwork data matching backend model structure
      const dimensions: any = {
        unit: formData.dimensions.unit as 'cm' | 'inch' | 'mm' | 'm'
      };
      
      // Only include dimension values if they exist and are valid numbers
      if (formData.dimensions.width && !isNaN(parseFloat(formData.dimensions.width))) {
        dimensions.width = parseFloat(formData.dimensions.width);
      }
      if (formData.dimensions.height && !isNaN(parseFloat(formData.dimensions.height))) {
        dimensions.height = parseFloat(formData.dimensions.height);
      }
      if (formData.dimensions.depth && !isNaN(parseFloat(formData.dimensions.depth))) {
        dimensions.depth = parseFloat(formData.dimensions.depth);
      }

      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);

      const artworkData: CreateArtworkData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        medium: formData.medium as CreateArtworkData['medium'],
        style: formData.style as CreateArtworkData['style'],
        images: uploadedImages,
        dimensions: Object.keys(dimensions).length > 1 ? dimensions : undefined,
        tags: tagsArray.length > 0 ? tagsArray : undefined,
        status: 'available'
      };

      // Create or update artwork based on mode
      let response;
      if (isEditMode && editArtworkId) {
        response = await artworkAPI.updateArtwork(editArtworkId, artworkData);
        console.log('Artwork updated successfully:', response);
      } else {
        response = await artworkAPI.createArtwork(artworkData);
      console.log('Artwork created successfully:', response);
      }
      
      // Show success modal
      setShowSuccessModal(true);
    } catch (err: any) {
      setErrors({
        general: err.message || 'Failed to upload artwork. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-light min-vh-100 py-4 py-md-5">
      <div className="container">
        <div className="text-center mb-4 mb-md-5">
          <h1 className="display-5 fw-bold mb-3">{isEditMode ? 'Edit Artwork' : 'Upload New Artwork'}</h1>
          <p className="lead text-muted">{isEditMode ? 'Update your artwork details' : 'Share your creative work with the world'}</p>
        </div>

        {errors.general && (
          <div className="alert alert-danger alert-dismissible fade show mb-4" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {errors.general}
            <button type="button" className="btn-close" onClick={() => setErrors({})} aria-label="Close"></button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-4 shadow-sm p-4 p-md-5">
          {/* Artwork Details Section */}
          <div className="mb-4 mb-md-5">
            <h2 className="h3 fw-bold mb-4 pb-2 border-bottom">Artwork Details</h2>
            <div className="mb-3">
              <label htmlFor="title" className="form-label fw-semibold">
                Artwork Title <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., 'Sunset Over the Ocean'"
              />
              {errors.title && <div className="invalid-feedback">{errors.title}</div>}
            </div>

            <div className="mb-3">
              <label htmlFor="description" className="form-label fw-semibold">
                Description <span className="text-danger">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your artwork, its inspiration, and unique qualities..."
                rows={4}
              />
              {errors.description && <div className="invalid-feedback">{errors.description}</div>}
            </div>

            <div className="mb-3">
              <label htmlFor="price" className="form-label fw-semibold">
                Price (USD) <span className="text-danger">*</span>
              </label>
              <input
                type="number"
                id="price"
                name="price"
                className={`form-control ${errors.price ? 'is-invalid' : ''}`}
                value={formData.price}
                onChange={handleInputChange}
                placeholder="e.g., 250.00"
                step="0.01"
                min="0"
              />
              {errors.price && <div className="invalid-feedback">{errors.price}</div>}
            </div>
          </div>

          {/* Artwork Image Section */}
          <div className="mb-4 mb-md-5">
            <h2 className="h3 fw-bold mb-4 pb-2 border-bottom">Artwork Image</h2>
            <div 
              className="border border-2 border-dashed rounded-4 p-5 text-center bg-light"
              style={{ cursor: 'pointer' }}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <i className="bi bi-cloud-upload display-3 text-primary mb-3"></i>
              <p className="mb-2">Drag 'n' drop an image here, or click to select a file</p>
              <p className="text-muted small mb-0">Max 10MB</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
            </div>
            
            {errors.files && (
              <div className="alert alert-danger mt-3 mb-0">
                <i className="bi bi-exclamation-circle me-2"></i>
                {errors.files}
              </div>
            )}

            {/* Image Preview */}
            {previewUrls.length > 0 && (
              <div className="mt-3">
                <div className="position-relative d-inline-block" style={{ maxWidth: '100%' }}>
                  <img 
                    src={previewUrls[0]} 
                    alt="Preview" 
                    className="img-fluid rounded"
                    style={{ maxHeight: '400px', objectFit: 'contain' }}
                  />
                    <button
                      type="button"
                    className="btn btn-danger btn-sm position-absolute top-0 end-0 m-1 rounded-circle"
                    style={{ width: '32px', height: '32px' }}
                    onClick={removeFile}
                    >
                    <i className="bi bi-x"></i>
                    </button>
                  </div>
              </div>
            )}
          </div>

          {/* Technical Specifications Section */}
          <div className="mb-4 mb-md-5">
            <h2 className="h3 fw-bold mb-4 pb-2 border-bottom">Technical Specifications</h2>
            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label htmlFor="medium" className="form-label fw-semibold">
                  Medium <span className="text-danger">*</span>
                </label>
                  <select
                    id="medium"
                    name="medium"
                  className={`form-select ${errors.medium ? 'is-invalid' : ''}`}
                    value={formData.medium}
                    onChange={handleInputChange}
                  >
                    <option value="">Select a medium</option>
                    <option value="Oil on Canvas">Oil on Canvas</option>
                    <option value="Acrylic">Acrylic</option>
                    <option value="Watercolor">Watercolor</option>
                    <option value="Digital Art">Digital Art</option>
                    <option value="Photography">Photography</option>
                    <option value="Sculpture">Sculpture</option>
                    <option value="Mixed Media">Mixed Media</option>
                    <option value="Pencil">Pencil</option>
                    <option value="Charcoal">Charcoal</option>
                    <option value="Other">Other</option>
                  </select>
                {errors.medium && <div className="invalid-feedback">{errors.medium}</div>}
              </div>

              <div className="col-md-6">
                <label htmlFor="style" className="form-label fw-semibold">
                  Style <span className="text-danger">*</span>
                </label>
                  <select
                    id="style"
                    name="style"
                  className={`form-select ${errors.style ? 'is-invalid' : ''}`}
                    value={formData.style}
                    onChange={handleInputChange}
                  >
                    <option value="">Select a style</option>
                    <option value="Abstract">Abstract</option>
                    <option value="Impressionism">Impressionism</option>
                    <option value="Realism">Realism</option>
                    <option value="Surrealism">Surrealism</option>
                    <option value="Contemporary">Contemporary</option>
                    <option value="Modern">Modern</option>
                    <option value="Pop Art">Pop Art</option>
                    <option value="Minimalism">Minimalism</option>
                    <option value="Expressionism">Expressionism</option>
                    <option value="Other">Other</option>
                  </select>
                {errors.style && <div className="invalid-feedback">{errors.style}</div>}
              </div>
            </div>

            <div className="row g-3 mb-3">
              <div className="col-md-3">
                <label htmlFor="width" className="form-label fw-semibold">Width</label>
                <input
                  type="number"
                  id="width"
                  name="dimensions.width"
                  className="form-control"
                  value={formData.dimensions.width}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                  step="0.1"
                />
              </div>

              <div className="col-md-3">
                <label htmlFor="height" className="form-label fw-semibold">Height</label>
                <input
                  type="number"
                  id="height"
                  name="dimensions.height"
                  className="form-control"
                  value={formData.dimensions.height}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                  step="0.1"
                />
              </div>

              <div className="col-md-3">
                <label htmlFor="depth" className="form-label fw-semibold">Depth</label>
                <input
                  type="number"
                  id="depth"
                  name="dimensions.depth"
                  className="form-control"
                  value={formData.dimensions.depth}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                  step="0.1"
                />
              </div>

              <div className="col-md-3">
                <label htmlFor="unit" className="form-label fw-semibold">Unit</label>
                  <select
                    id="unit"
                    name="dimensions.unit"
                  className="form-select"
                    value={formData.dimensions.unit}
                    onChange={handleInputChange}
                  >
                    <option value="cm">cm</option>
                    <option value="inch">inch</option>
                    <option value="mm">mm</option>
                    <option value="m">m</option>
                  </select>
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="tags" className="form-label fw-semibold">Tags</label>
              <input
                type="text"
                id="tags"
                name="tags"
                className="form-control"
                value={formData.tags}
                onChange={handleInputChange}
                placeholder="Enter tags separated by commas"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="d-flex gap-3 justify-content-end pt-3 border-top">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => navigate('/dashboard')}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  {isEditMode ? 'Updating...' : 'Uploading...'}
                </>
              ) : (
                <>
                  <i className={`bi ${isEditMode ? 'bi-check-circle' : 'bi-cloud-upload'} me-2`}></i>
                  {isEditMode ? 'Update Artwork' : 'Upload Artwork'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Success Modal */}
      <div className={`modal fade ${showSuccessModal ? 'show' : ''}`} style={{ display: showSuccessModal ? 'block' : 'none' }} tabIndex={-1}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body text-center py-5">
              <div className="mb-3">
                <i className="bi bi-check-circle-fill text-success display-2"></i>
              </div>
              <h3 className="fw-bold mb-3">{isEditMode ? 'Artwork Updated Successfully!' : 'Artwork Uploaded Successfully!'}</h3>
              <p className="text-muted mb-4">{isEditMode ? 'Your artwork has been updated successfully.' : 'Your artwork has been uploaded and is now live on the platform.'}</p>
              <button 
                className="btn btn-primary"
                onClick={() => navigate('/dashboard')}
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
      {showSuccessModal && <div className="modal-backdrop fade show"></div>}
    </div>
  );
};

export default UploadPage;

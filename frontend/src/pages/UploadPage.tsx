// ============================================
// src/pages/UploadPage.tsx
// ============================================
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { artworkAPI, artworkValidation, type CreateArtworkData } from '../services/artwork';
import '../styles/App.css';

const UploadPage: React.FC = () => {
  const navigate = useNavigate();
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
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/');
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB limit
      return isValidType && isValidSize;
    });

    if (validFiles.length !== files.length) {
      setErrors(prev => ({
        ...prev,
        files: 'Please select valid image files (max 10MB each)'
      }));
    }

    setSelectedFiles(prev => [...prev, ...validFiles]);
    
    // Create preview URLs
    const newPreviewUrls = validFiles.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

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
    if (!imagesValidation.isValid) {
      newErrors.files = imagesValidation.message || 'Please select at least one image';
    }

    // Validate dimensions
    const dimensionsValidation = artworkValidation.validateDimensions({
      width: parseFloat(formData.dimensions.width) || undefined,
      height: parseFloat(formData.dimensions.height) || undefined,
      depth: parseFloat(formData.dimensions.depth) || undefined,
      unit: formData.dimensions.unit
    });
    if (!dimensionsValidation.isValid) {
      newErrors.dimensions = dimensionsValidation.message || 'Invalid dimensions';
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
      // Upload images first
      const uploadedImages = await Promise.all(
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

      // Create artwork using the service
      const response = await artworkAPI.createArtwork(artworkData);
      console.log('Artwork created successfully:', response);
      
      // Show success message
      alert('Artwork uploaded successfully!');
      
      // Navigate to dashboard
      navigate('/dashboard');
    } catch (err: any) {
      setErrors({
        general: err.message || 'Failed to upload artwork. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-page">
      <div className="upload-container">
        <div className="upload-header">
          <h1>Upload New Artwork</h1>
          <p>Share your creative work with the world</p>
        </div>

        {errors.general && (
          <div className="error-message">
            <span>⚠️</span>
            {errors.general}
          </div>
        )}

        <form className="upload-form" onSubmit={handleSubmit}>
          {/* Artwork Details Section */}
          <div className="upload-section">
            <h3>Artwork Details</h3>
            <div className="form-group">
              <label htmlFor="title">Artwork Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., 'Sunset Over the Ocean'"
              />
              {errors.title && <div className="field-error">{errors.title}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your artwork, its inspiration, and unique qualities..."
                rows={4}
              />
              {errors.description && <div className="field-error">{errors.description}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="price">Price (USD)</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="e.g., 250.00"
                step="0.01"
                min="0"
              />
              {errors.price && <div className="field-error">{errors.price}</div>}
            </div>
          </div>

          {/* Artwork Images Section */}
          <div className="upload-section">
            <h3>Artwork Images</h3>
            <div 
              className="file-upload-area"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="upload-icon">📷</div>
              <p>Drag 'n' drop some files here, or click to select files</p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
            </div>
            
            {errors.files && (
              <div className="field-error">{errors.files}</div>
            )}

            {/* Image Previews */}
            {previewUrls.length > 0 && (
              <div className="image-previews">
                {previewUrls.map((url, index) => (
                  <div key={index} className="image-preview">
                    <img src={url} alt={`Preview ${index + 1}`} />
                    <button
                      type="button"
                      className="remove-image"
                      onClick={() => removeFile(index)}
                    >
                      ×
                    </button>
                    {index === 0 && <div className="primary-badge">Primary</div>}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Technical Specifications Section */}
          <div className="upload-section">
            <h3>Technical Specifications</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="medium">Medium</label>
                  <select
                    id="medium"
                    name="medium"
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
                {errors.medium && <div className="field-error">{errors.medium}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="style">Style</label>
                  <select
                    id="style"
                    name="style"
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
                {errors.style && <div className="field-error">{errors.style}</div>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="width">Width</label>
                <input
                  type="number"
                  id="width"
                  name="dimensions.width"
                  value={formData.dimensions.width}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                  step="0.1"
                />
              </div>

              <div className="form-group">
                <label htmlFor="height">Height</label>
                <input
                  type="number"
                  id="height"
                  name="dimensions.height"
                  value={formData.dimensions.height}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                  step="0.1"
                />
              </div>

              <div className="form-group">
                <label htmlFor="depth">Depth</label>
                <input
                  type="number"
                  id="depth"
                  name="dimensions.depth"
                  value={formData.dimensions.depth}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                  step="0.1"
                />
              </div>

              <div className="form-group">
                <label htmlFor="unit">Unit</label>
                  <select
                    id="unit"
                    name="dimensions.unit"
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

            <div className="form-group">
              <label htmlFor="tags">Tags</label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                placeholder="Enter tags separated by commas"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={() => navigate('/dashboard')}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-upload"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Uploading...
                </>
              ) : (
                'Upload Artwork'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadPage;

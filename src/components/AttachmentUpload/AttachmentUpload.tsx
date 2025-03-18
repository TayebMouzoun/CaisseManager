import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Snackbar,
  Alert,
  Typography,
  Paper,
} from '@mui/material';
import { CloudUpload, Delete, Visibility } from '@mui/icons-material';
import { addAttachmentToOperation } from '../../services/slices/cashSlice';

interface AttachmentUploadProps {
  operationId: string;
  existingAttachmentUrl?: string;
}

const AttachmentUpload: React.FC<AttachmentUploadProps> = ({
  operationId,
  existingAttachmentUrl,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(existingAttachmentUrl || null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    
    if (!selectedFile) {
      return;
    }
    
    // Check file type - only allow images and PDFs
    if (!['image/jpeg', 'image/png', 'image/gif', 'application/pdf'].includes(selectedFile.type)) {
      setError(t('invalidFileType'));
      return;
    }
    
    // Check file size - max 5MB
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError(t('fileTooLarge'));
      return;
    }
    
    setFile(selectedFile);
    
    // Create preview for images
    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      // For PDFs, just show an icon or text
      setPreviewUrl('pdf');
    }
    
    setError(null);
  };
  
  const handleUpload = async () => {
    if (!file) {
      setError(t('noFileSelected'));
      return;
    }
    
    setIsUploading(true);
    
    try {
      // In a real application, you would use a backend API to upload files
      // For this demo, we'll simulate an upload and generate a fake URL
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      
      // Create a fake URL (in a real app, this would come from your storage service)
      const fakeUploadedUrl = URL.createObjectURL(file);
      
      // Update the operation with the attachment URL
      dispatch(addAttachmentToOperation({
        operationId,
        attachmentUrl: fakeUploadedUrl,
      }));
      
      setSuccess(true);
      setIsUploading(false);
    } catch (err) {
      setError(t('uploadFailed'));
      setIsUploading(false);
    }
  };
  
  const handleClearFile = () => {
    setFile(null);
    setPreviewUrl(existingAttachmentUrl || null);
  };
  
  const handleViewAttachment = () => {
    if (previewUrl && previewUrl !== 'pdf') {
      window.open(previewUrl, '_blank');
    }
  };
  
  return (
    <Box>
      <Paper sx={{ p: 2, mb: 2, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          {t('attachment')}
        </Typography>
        
        {previewUrl && previewUrl !== 'pdf' ? (
          <Box sx={{ mb: 2, position: 'relative' }}>
            <img
              src={previewUrl}
              alt={t('attachment')}
              style={{
                maxWidth: '100%',
                maxHeight: '200px',
                display: 'block',
                margin: '0 auto',
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                right: 0,
                display: 'flex',
                gap: 1,
                bgcolor: 'rgba(0,0,0,0.5)',
                borderRadius: '0 0 0 8px',
              }}
            >
              <IconButton size="small" onClick={handleViewAttachment} sx={{ color: 'white' }}>
                <Visibility />
              </IconButton>
              {!existingAttachmentUrl && (
                <IconButton size="small" onClick={handleClearFile} sx={{ color: 'white' }}>
                  <Delete />
                </IconButton>
              )}
            </Box>
          </Box>
        ) : previewUrl === 'pdf' ? (
          <Box
            sx={{
              p: 2,
              mb: 2,
              border: '1px dashed #ccc',
              borderRadius: 1,
              textAlign: 'center',
            }}
          >
            <Typography variant="body1">PDF Document</Typography>
            <Button
              startIcon={<Visibility />}
              onClick={handleViewAttachment}
              sx={{ mt: 1 }}
            >
              {t('viewAttachment')}
            </Button>
          </Box>
        ) : (
          <Box
            sx={{
              p: 3,
              mb: 2,
              border: '1px dashed #ccc',
              borderRadius: 1,
              textAlign: 'center',
              bgcolor: '#f9f9f9',
            }}
          >
            <input
              accept="image/*,application/pdf"
              style={{ display: 'none' }}
              id="attachment-upload"
              type="file"
              onChange={handleFileChange}
            />
            <label htmlFor="attachment-upload">
              <Button
                variant="outlined"
                component="span"
                startIcon={<CloudUpload />}
                sx={{ mb: 1 }}
              >
                {t('selectFile')}
              </Button>
            </label>
            <Typography variant="body2" color="textSecondary">
              {t('supportedFormats')}: JPG, PNG, PDF (max 5MB)
            </Typography>
          </Box>
        )}
        
        {file && !existingAttachmentUrl && (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpload}
              disabled={isUploading}
              startIcon={isUploading ? <CircularProgress size={20} /> : null}
            >
              {isUploading ? t('uploading') : t('addAttachment')}
            </Button>
          </Box>
        )}
      </Paper>
      
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert onClose={() => setError(null)} severity="error">
          {error}
        </Alert>
      </Snackbar>
      
      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={() => setSuccess(false)}
      >
        <Alert onClose={() => setSuccess(false)} severity="success">
          {t('uploadSuccess')}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AttachmentUpload; 
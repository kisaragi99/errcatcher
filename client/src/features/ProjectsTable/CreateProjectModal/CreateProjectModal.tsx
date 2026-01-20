import { useState, ChangeEvent } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  CircularProgress,
  IconButton,
  Typography,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';


interface CustomField {
  key: string;
  value: string;
  keyError?: string;
  valueError?: string;
}

interface FormData {
  name: string;
  description: string;
  custom_fields: CustomField[];
}

interface FormErrors {
  name?: string;
  description?: string;
  custom_fields?: string;
}

interface CreateProjectModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (data: { 
    name: string; 
    description?: string; 
    custom_fields?: Record<string, string> 
  }) => Promise<void>;
  loading: boolean;
}

export const CreateProjectModal = ({
  open,
  onClose,
  onCreate,
  loading,
}: CreateProjectModalProps) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    custom_fields: [{ key: '', value: '' }],
  });
  
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      setErrors(newErrors);
      return false;
    }
    
    if (Object.keys(errors).length > 0) {
      setErrors({});
    }
    
    return true;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleCustomFieldChange = (index: number, field: 'key' | 'value', value: string) => {
    const updatedCustomFields = [...formData.custom_fields];
    updatedCustomFields[index] = {
      ...updatedCustomFields[index],
      [field]: value,
      [`${field}Error`]: ''
    };
    
    setFormData(prev => ({
      ...prev,
      custom_fields: updatedCustomFields
    }));
  };

  const addCustomField = () => {
    setFormData(prev => ({
      ...prev,
      custom_fields: [...prev.custom_fields, { key: '', value: '' }]
    }));
  };

  const removeCustomField = (index: number) => {
    const newFields = [...formData.custom_fields];
    newFields.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      custom_fields: newFields.length ? newFields : [{ key: '', value: '' }]
    }));
  }; 
  
  const formatCustomFields = (fields: CustomField[]): Record<string, string> => {
    return fields.reduce<Record<string, string>>((acc, { key, value }) => {
      if (key?.trim() && value?.trim()) {
        acc[key.trim()] = value.trim();
      }
      return acc;
    }, {});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const customFields = formatCustomFields(formData.custom_fields);
      const projectData: { 
        name: string; 
        description?: string; 
        custom_fields?: Record<string, string> 
      } = {
        name: formData.name,
      };

      if (formData.description.trim()) {
        projectData.description = formData.description;
      }

      if (Object.keys(customFields).length > 0) {
        projectData.custom_fields = customFields;
      }

      await onCreate(projectData);

      setFormData({
        name: '',
        description: '',
        custom_fields: [{ key: '', value: '' }],
      });
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Create New Project</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              name="name"
              label="Project Name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              error={!!errors.name}
              helperText={errors.name}
              disabled={loading}
              margin="normal"
            />
            <TextField
              name="description"
              label="Description (Optional)"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={2}
              fullWidth
              disabled={loading}
              margin="normal"
            />
            <Box sx={{ mt: 2, mb: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                Custom Fields
              </Typography>
              {formData.custom_fields.map((field, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 2, mb: 1, alignItems: 'flex-start' }}>
                <Box sx={{ flex: 1 }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Key"
                    value={field.key}
                    onChange={(e) => handleCustomFieldChange(index, 'key', e.target.value)}
                    error={!!field.keyError}
                    helperText={field.keyError}
                    disabled={loading}
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Value"
                    value={field.value}
                    onChange={(e) => handleCustomFieldChange(index, 'value', e.target.value)}
                    error={!!field.valueError}
                    helperText={field.valueError}
                    disabled={loading}
                  />
                </Box>
                <Box>
                  {formData.custom_fields.length > 1 && (
                    <IconButton 
                      size="small" 
                      onClick={() => removeCustomField(index)}
                      disabled={loading}
                      color="error"
                      sx={{ mt: 0.5 }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  )}
                </Box>
              </Box>
              ))}
              <Button
                variant="outlined"
                size="small"
                startIcon={<AddIcon />}
                onClick={addCustomField}
                disabled={loading}
                sx={{ mt: 1 }}
              >
                Add Field
              </Button>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : undefined}
          >
            {loading ? 'Creating...' : 'Create Project'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

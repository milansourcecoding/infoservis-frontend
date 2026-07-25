import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLocales } from 'src/locales';

// Adjust these imports to your project structure
import axiosInstance from 'src/utils/axios';
import DropdownAutocomplete from 'src/components/autocomplete/DropdownAutocomplete.tsx';



// @mui
import {
  Box,
  Card,
  Stack,
  Button,
  TextField,
  Typography,
} from '@mui/material';
import { getManagerTypes } from '../../../utils/utils.tsx';
// ----------------------------------------------------------------------

interface UserOption {
  id: number;
  name: string;
  email?: string;
}

interface ManagerTypeOption {
  id: string;
  value: string;
}

interface OrganizationOption {
  id: string;
  value: string;
}

export default function BuildingManagerCreatePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLocales();

  const [userOptions, setUserOptions] = useState<UserOption[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserOption | null>(null);

  const [organizationOptions, setOrganizationOptions] = useState<OrganizationOption[]>([]);
  const [selectedOrganization, setSelectedOrganization] = useState<OrganizationOption | null>(null);

  const [managerType, setManagerType] = useState('');
  const [organizationId, setOrganizationId] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [description, setDescription] = useState('');

  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingOrganizations, setLoadingOrganizations] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [userError, setUserError] = useState(false);
  const [organizationError, setOrganizationError] = useState(false);

  const [managerTypeOptions] = useState<ManagerTypeOption[]>(getManagerTypes().map((option) => ({
  ...option,
  value: t(`building.details.${option.id}`),
})));
const [selectedManagerType, setSelectedManagerType] =
  useState<ManagerTypeOption | null>(null);

  const searchUsers = async (_event: any, search: string) => {
    if (search.length < 3) {
      setUserOptions([]);
      return;
    }

    try {
      setLoadingUsers(true);

      const response = await axiosInstance.get('/user/all', {
        params: {
          search,
        },
      });

      setUserOptions(response.data.data ?? []);
    } catch (error) {
      console.error('Unable to load users:', error);
      setUserOptions([]);
    } finally {
      setLoadingUsers(false);
    }
  };

    const searchOrganizations = async (_event: any, search: string) => {
    if (search.length < 3) {
      setOrganizationOptions([]);
      return;
    }

    try {
      setLoadingOrganizations(true);

      const response = await axiosInstance.get('/organization/all', {
        params: {
          search,
        },
      });

      setOrganizationOptions(response.data.data ?? []);
    } catch (error) {
      console.error('Unable to load organizations:', error);
      setOrganizationOptions([]);
    } finally {
      setLoadingOrganizations(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedUser) {
      setUserError(true);
      return;
    }

    try {
      setSubmitting(true);
      setUserError(false);
      await axiosInstance.post(`/building/${id}/manager`, {
        user_id: selectedUser.id,
        managerType: selectedManagerType?.id,
        organization_id: selectedOrganization?.id,
        licenseNumber,
        description
      });

      navigate(`/building/${id}`);
    } catch (error) {
      console.error('Unable to save manager:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography variant="h4">
            {t('building.details.add_manager')}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {t('building.details.title')}
          </Typography>
        </Box>

        <Button
          variant="outlined"
          onClick={() => navigate(`/building/${id}`)}
        >
          {t('building.details.back_to_building')}
        </Button>
      </Stack>

      <Card sx={{ p: 3 }}>
        <Stack spacing={2}>
          <DropdownAutocomplete
            freeSolo={false}
            multiple={false}
            disableClearable
            labelField="name"
            label={t('building.details.user')}
            options={userOptions}
            value={selectedUser}
            onChange={(event, value: UserOption | null) => {
              event?.preventDefault();
              event?.stopPropagation();

              setSelectedUser(value);
              setUserError(false);
            }}
            onInputChange={searchUsers}
            error={userError}
          />

          <DropdownAutocomplete
            freeSolo={false}
            multiple={false}
            disableClearable
            labelField="value"
            label={t('building.details.manager_type')}
            options={managerTypeOptions}
            value={selectedManagerType}
            onChange={(event, value: ManagerTypeOption | null) => {
              event?.preventDefault();
              event?.stopPropagation();

              setSelectedManagerType(value);
            }}
            onInputChange={() => {}}
          />
          
          <DropdownAutocomplete
            freeSolo={false}
            multiple={false}
            disableClearable
            labelField="name"
            label={t('building.details.organization')}
            options={organizationOptions}
            value={selectedOrganization}
            onChange={(event, value: OrganizationOption | null) => {
              event?.preventDefault();
              event?.stopPropagation();

              setSelectedOrganization(value);
              setOrganizationError(false);
            }}
            onInputChange={searchOrganizations}
            error={organizationError}
          />

          <TextField
            label={t('building.details.license_number')}
            value={licenseNumber}
            onChange={(event) => setLicenseNumber(event.target.value)}
            fullWidth
          />
          <TextField
            label={t('building.details.description')}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            fullWidth
          />

          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              disabled={submitting || loadingUsers}
              onClick={handleSubmit}
            >
              {submitting ? t('building.details.save') : t('building.details.save')}
            </Button>

            <Button
              variant="outlined"
              disabled={submitting}
              onClick={() => navigate(`/building/${id}`)}
            >
              {t('building.details.cancel')}
            </Button>
          </Stack>
        </Stack>
      </Card>
    </Box>
  );
}
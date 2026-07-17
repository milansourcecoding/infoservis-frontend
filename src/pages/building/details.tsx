import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

// @mui
import {
  Box,
  Card,
  Grid,
  Stack,
  Table,
  Button,
  Divider,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  ListItemText,
  TableContainer,
} from '@mui/material';

import Label from 'src/components/label';
import { Icon } from '@iconify/react';
import { useLocales } from 'src/locales';
import { dateTimeFormat } from '../../utils/utils.tsx';

import { RootState, AppDispatch, useTypedSelector } from '../../utils/store.tsx';

import slice from './slice.tsx';

import { ManagerType, UnitType } from '../../utils/enums.tsx';



// ----------------------------------------------------------------------

export default function BuildingDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { t } = useLocales();

  const buildingSlice = useTypedSelector((state: RootState) => state.buildingSlice as any);

 

  const building = buildingSlice.details ?? null;
  const isLoading = buildingSlice.isLoading;

  const getManagerTypeLabel = (managerType: string) => {
    switch (managerType) {
      case ManagerType.ProfessionalManager:
        return t('building.details.professional_manager');

      case ManagerType.ResidentManager:
        return t('building.details.resident_manager');

      default:
        return '-';
    }
  };

    const getUnitTypeLabel = (unitType: string) => {
    switch (unitType) {
      case UnitType.Apartment:
        return t('building.details.apartment');

      case UnitType.Basement:
        return t('building.details.basement');

      case UnitType.Attic:
        return t('building.details.attic');

      case UnitType.Commercial:
        return t('building.details.commercial');

      case UnitType.Garage:
        return t('building.details.garage');

      case UnitType.Office:
        return t('building.details.office');

      case UnitType.Storage:
        return t('building.details.storage');

      case UnitType.Common:
        return t('building.details.common');

      case UnitType.BoilerRoom:
        return t('building.details.boiler_room');

      case UnitType.LaundryRoom:
        return t('building.details.laundry_room');

      case UnitType.SecurityRoom:
        return t('building.details.security_room');

      case UnitType.TechnicalRoom:
        return t('building.details.technical_room');

      case UnitType.ParkingSpace:
        return t('building.details.parking_space');

      case UnitType.Other:
        return t('building.details.other');

      default:
        return '-';
    }
  };

  useEffect(() => {
    if (id) {
      dispatch(
        slice.callDetailsApi(Number(id), (state: boolean, data: any, message: string) => {
          if (!state) {
            console.log(message);
          }
        })
      );
    }
  }, [dispatch, id]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!building) {
    return <div>Building not found</div>;
  }

  const manager = building.manager ?? null;
  const managerUser = manager?.user ?? null;
  const units = building.units ?? [];

  const renderField = (label: string, value: any) => (
    <Grid item xs={12} sm={6} md={4}>
      <ListItemText
        primary={value || '-'}
        secondary={label}
        primaryTypographyProps={{ typography: 'body2' }}
        secondaryTypographyProps={{
          component: 'span',
          typography: 'caption',
          color: 'text.disabled',
        }}
      />
    </Grid>
  );

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
            {building.name}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {t('building.details.title')}
          </Typography>
        </Box>

        <Stack direction="row" spacing={1}>
          <Button
            variant="contained"
            startIcon={<Icon icon="mingcute:add-line" />}
            onClick={() => navigate(`/building/${id}/units/create`)}
          >
           {t('building.details.add_unit')}
          </Button>

          <Button
            variant="outlined"
            startIcon={<Icon icon="mingcute:user-add-line" />}
            onClick={() => navigate(`/building/${id}/managers/create`)}
          >
            {t('building.details.add_manager')}
          </Button>
        </Stack>
      </Stack>

      <Card sx={{ p: 3, mb: 3 }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: 2 }}
        >
          <Typography variant="h6">
            {t('building.details.basic_information')}
          </Typography>

          <Label
            variant="soft"
            color={building.is_active ? 'success' : 'error'}
          >
            {building.is_active ? 'Active' : 'Inactive'}
          </Label>
        </Stack>

        <Grid container spacing={3}>
          {renderField(t('building.details.name'), building.name)}
          {renderField(t('building.details.email'), building.email)}
          {renderField(t('building.details.address'), building.address)}
          {renderField(t('building.details.city'), building.city)}
          {renderField(t('building.details.description'), building.description)}
        </Grid>
      </Card>

      <Card sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {t('building.details.technical_information')}
        </Typography>

        <Grid container spacing={3}>
          {renderField(t('building.details.units_number'), building.units_number)}
          {renderField(t('building.details.area'), building.area)}
          {renderField(t('building.details.year_of_construction'), building.year_of_construction)}
          {renderField(t('building.details.number_of_floors'), building.number_of_floors)}
          {renderField(t('building.details.number_of_elevators'), building.number_of_elevators)}
          {renderField(t('building.details.roof_type'), building.roof_type)}
          {renderField(t('building.details.lightning_rod'), building.lightning_rod ? t('building.details.yes') : t('building.details.no'))}
          {renderField(t('building.details.shelter'), building.shelter ? t('building.details.yes') : t('building.details.no'))}
          {renderField(t('building.details.remote_heating'), building.remote_heating ? t('building.details.yes') : t('building.details.no'))}
          {renderField(t('building.details.parking'), building.parking ? t('building.details.yes') : t('building.details.no'))}
        </Grid>
      </Card>

      <Card sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {t('building.details.legal_information')}
        </Typography>

        <Grid container spacing={3}>
          {renderField(t('building.details.pib'), building.pib)}
          {renderField(t('building.details.registration_number'), building.registration_number)}
          {renderField(t('building.details.bank_account'), building.bank_account)}
          {renderField(t('building.details.bank_ammount'), building.bank_ammount)}
        </Grid>
      </Card>






{/* MANAGER */}

    <Card sx={{ p: 3, mb: 3 }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        <Typography variant="h6">
          {t('building.details.manager')}
        </Typography>

        {manager && (
          <Button
            size="small"
            variant="outlined"
            onClick={() => navigate(`/manager/${manager.id}`)}
          >
            {t('building.details.view_manager')}
          </Button>
        )}
      </Stack>

      {manager ? (
        <Grid container spacing={3}>
          {renderField(
            t('building.details.manager_name'),
            managerUser?.name
          )}

          {renderField(
            t('building.details.manager_email'),
            managerUser?.email
          )}

          {renderField(
            t('building.details.manager_phone'),
            managerUser?.phone
          )}

          {renderField(
            t('building.details.manager_type'),
            getManagerTypeLabel(manager.manager_type)
          )}

          {renderField(
            t('building.details.license_number'),
            manager.license_number
          )}

          {renderField(
            t('building.details.description'),
            manager.description
          )}
        </Grid>
      ) : (
        <Typography variant="body2" color="text.secondary">
          {t('building.details.no_manager')}
        </Typography>
      )}
    </Card>



{/* UNITS */}

    <Card sx={{ mb: 3 }}> 
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 3, pb: 2 }} > 
        <Typography variant="h6"> {t('building.details.units')}</Typography> 
        <Typography variant="body2" color="text.secondary"> {units.length} </Typography> 
      </Stack> 
      <TableContainer> 
        <Table> 
          <TableHead> 
            <TableRow> 
              <TableCell> {t('building.details.unit_name')} </TableCell> 
              <TableCell> {t('building.details.unit_type')} </TableCell> 
              <TableCell> {t('building.details.area')} </TableCell>
              <TableCell> {t('building.details.unit_number')} </TableCell> 
              <TableCell> {t('building.details.floor')} </TableCell> 
              <TableCell> {t('building.details.owner')} </TableCell> 
              <TableCell> {t('building.details.tenant')} </TableCell> 
              <TableCell> {t('building.details.associated_user')} </TableCell>
              <TableCell> {t('building.details.description')} </TableCell>





              <TableCell align="right"> {t('building.details.actions')} </TableCell>
            </TableRow> 
          </TableHead> 
          <TableBody> {units.length > 0 ? ( units.map((unit: any) => ( <TableRow key={unit.id} hover > 
            <TableCell> {unit.name ?? unit.unit_number ?? '-'} </TableCell>
            <TableCell> {getUnitTypeLabel(unit.unit_type) ?? '-'} </TableCell> 
            <TableCell> {unit.area ?? '-'} </TableCell> 
            <TableCell> {unit.unit_number ?? '-'} </TableCell> 
            <TableCell> {unit.floor ?? '-'} </TableCell> 
            <TableCell> {unit.owner ?? '-'} </TableCell>
            <TableCell> {unit.tenant ?? '-'} </TableCell>
            <TableCell> {unit.user?.name ?? '-'} </TableCell>
            <TableCell> {unit.description ?? '-'} </TableCell>


            <TableCell align="right"> 
              <Button size="small" onClick={() => navigate(`/building/${id}/units/${unit.id}`) } > {t('building.details.view')} </Button>
            </TableCell> 
            </TableRow> )) ) : 
            ( <TableRow> 
                <TableCell colSpan={6} align="center" sx={{ py: 4 }} > 
                  <Typography variant="body2" color="text.secondary" > {t('building.details.no_units')} </Typography> 
                </TableCell> 
              </TableRow> )} 
          </TableBody> 
        </Table> 
      </TableContainer> 
      </Card>

      {/* END UNITS */}

      
      <Card sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {t('building.details.system_information')}
        </Typography>

        <Grid container spacing={3}>
          {renderField(
            t('building.details.created_at'),
            building.created_at
              ? format(new Date(building.created_at), dateTimeFormat())
              : '-'
          )}

          {renderField(t('building.details.updated_by'), building.updated_user_name)}
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            onClick={() => navigate('/building')}
          >
           {t('building.details.back_to_list')}
          </Button>

          <Button
            variant="contained"
            onClick={() => navigate(`/building/${id}/edit`)}
          >
            {t('building.details.edit_building')}
          </Button>
        </Stack>
      </Card>
    </Box>
  );
}
/* eslint-disable arrow-body-style */
/* eslint-disable prefer-template */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-else-return */
import React from 'react';

import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { format } from 'date-fns';

import { useDispatch } from 'react-redux';
import { useLocales } from 'src/locales';

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
  IconButton,
} from '@mui/material';
import { Icon } from '@iconify/react';

// import { BlockPage } from 'src/components/block/block';
import MainContainer from 'src/components/container/MainContainer.tsx';
import Label from 'src/components/label';
import EmptyContent from 'src/components/empty-content';

import { RootState, AppDispatch, useTypedSelector } from '../../utils/store.tsx';
import slice, { LANGUAGE, pageRoles, getManagerTypeLabel, getUnitTypeLabel, renderField } from './slice.tsx';

import { dateTimeFormat, formatCurrency, formatArea } from '../../utils/utils.tsx';
// import {  } from '../../utils/enums.tsx';


// ----------------------------------------------------------------------


export default function BuildingDetailsPage() {
  const { t } = useLocales();
  const { id } = useParams();

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();


  const { isLoading, details } = useTypedSelector((state: RootState) => state.buildingSlice as any);


  React.useEffect(() => {
    if (id) {
      dispatch(slice.callDetailsApi(Number(id), (state: boolean, data: any, message: string) => {}));
    }
  }, [id]);


  const loading = () => {
    if(isLoading){
      return <EmptyContent
        filled
        title={t('table.loading')}
        sx={{
          py: 10,
        }}
        imgUrl={'/assets/icons/components/ic_pagination.svg'}
        action={undefined}
        description={undefined}
      />

    } else {
      return <EmptyContent
        filled
        title={t('table.noData')}
        sx={{
          py: 10,
        }}
        imgUrl={'/assets/icons/empty/ic_folder_empty.svg'}
        action={undefined}
        description={undefined}
      />
    }
  }


  const topSection = () => {
    return <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{ mb: 3 }}
    >
      <Stack spacing={1} direction="row" alignItems="flex-start">
        <IconButton component={RouterLink} to={`/building`}>
          <Icon icon="eva:arrow-ios-back-fill" />
        </IconButton>

        <Stack spacing={0.5}>
          <Stack spacing={1} direction="row" alignItems="center">
            <Typography variant="h4">{details?.name}</Typography>
          </Stack>
          <Typography variant="body2" sx={{ color: 'text.disabled' }}>{t('building.details.title')}</Typography>
        </Stack>
      </Stack>

      <Stack direction="row" spacing={1}>
        <Button
          variant="contained"
          startIcon={<Icon icon="mingcute:add-line" />}
          onClick={() => navigate(`/building/${details?.id}/units/create`)}
        >
          {t('building.details.add_unit')}
        </Button>

        <Button
          variant="outlined"
          startIcon={<Icon icon="mingcute:user-add-line" />}
          onClick={() => navigate(`/building/${details?.id}/managers/create`)}
        >
          {t('building.details.add_manager')}
        </Button>
      </Stack>
    </Stack>
  }

  const basicDataSection = () => {
    return <Card sx={{ p: 3, mb: 3 }}>
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
          color={details?.is_active ? 'success' : 'error'}
        >
          {details?.is_active ? 'Active' : 'Inactive'}
        </Label>
      </Stack>

      <Grid container spacing={3}>
        {renderField(t('building.details.name'), details?.name)}
        {renderField(t('building.details.address'), details?.address)}
        {renderField(t('building.details.city'), details?.city)}
        {renderField(t('building.details.description'), details?.description)}
      </Grid>
    </Card>
  }

  const technicalInformationSection = () => {
    return <Card sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        {t('building.details.technical_information')}
      </Typography>

      <Grid container spacing={3}>
        {renderField(t('building.details.units_number'), details?.units_number)}
        {renderField(t('building.details.area'), formatArea(details?.area))}
        {renderField(t('building.details.year_of_construction'), details?.year_of_construction)}
        {renderField(t('building.details.number_of_floors'), details?.number_of_floors)}
        {renderField(t('building.details.number_of_elevators'), details?.number_of_elevators)}
        {renderField(t('building.details.roof_type'), details?.roof_type)}
        {renderField(t('building.details.lightning_rod'), details?.lightning_rod ? t('building.details.yes') : t('building.details.no'))}
        {renderField(t('building.details.shelter'), details?.shelter ? t('building.details.yes') : t('building.details.no'))}
        {renderField(t('building.details.remote_heating'), details?.remote_heating ? t('building.details.yes') : t('building.details.no'))}
        {renderField(t('building.details.parking'), details?.parking ? t('building.details.yes') : t('building.details.no'))}
      </Grid>
    </Card>
  }
  
  const legalInformationSection = () => {
    return <Card sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        {t('building.details.legal_information')}
      </Typography>

      <Grid container spacing={3}>
        {renderField(t('building.details.pib'), details?.pib)}
        {renderField(t('building.details.registration_number'), details?.registration_number)}
        {renderField(t('building.details.bank_account'), details?.bank_account)}
        {renderField(t('building.details.bank_ammount'), formatCurrency(details?.bank_ammount))}
      </Grid>
    </Card>
  }
  
  const menagerSection = () => {
    return <Card sx={{ p: 3, mb: 3 }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        <Typography variant="h6">
          {t('building.details.manager')}
        </Typography>

        {details?.manager && (
          <Button
            size="small"
            variant="outlined"
            onClick={() => navigate(`/manager/${details?.manager?.id}`)}
          >
            {t('building.details.view_manager')}
          </Button>
        )}
      </Stack>

      {details?.manager ? (
        <Grid container spacing={3}>
          {renderField(
            t('building.details.manager_name'),
            details?.manager?.user?.name || ''
          )}

          {renderField(
            t('building.details.manager_email'),
            details?.manager?.user?.email || ''
          )}

          {renderField(
            t('building.details.manager_phone'),
            details?.manager?.user?.phone || ''
          )}

          {renderField(
            t('building.details.manager_type'),
            getManagerTypeLabel(details?.manager.manager_type, t)
          )}

          {renderField(
            t('building.details.license_number'),
            details?.manager.license_number
          )}

          {renderField(
            t('building.details.description'),
            details?.manager.description
          )}
          {renderField(
            t('building.details.organization'),
            details?.manager?.organization?.name
          )}
        </Grid>
      ) : (
        <Typography variant="body2" color="text.secondary">
          {t('building.details.no_manager')}
        </Typography>
      )}
    </Card>
  }
  
  const unitsSection = () => {
    return <Card sx={{ mb: 3 }}> 
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 3, pb: 2 }} > 
        <Typography variant="h6"> {t('building.details.units')}</Typography> 
        <Typography variant="body2" color="text.secondary">{(details && details.units && details.units.length > 0) ? details.units.length : 0} </Typography> 
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
              <TableCell align="right"> {t('buttons.actions')} </TableCell>
            </TableRow> 
          </TableHead> 
          <TableBody> {(details && details.units && details.units.length > 0) ? ( details.units.map((unit: any) => ( <TableRow key={unit.id} hover > 
            <TableCell> {unit.name ?? unit.unit_number ?? '-'} </TableCell>
            <TableCell> {getUnitTypeLabel(unit.unit_type, t) ?? '-'} </TableCell> 
            <TableCell> {unit.area ?? '-'} </TableCell> 
            <TableCell> {unit.unit_number ?? '-'} </TableCell> 
            <TableCell> {unit.floor ?? '-'} </TableCell> 
            <TableCell> {unit.owner ?? '-'} </TableCell>
            <TableCell> {unit.tenant ?? '-'} </TableCell>
            <TableCell> {unit.user?.name ?? '-'} </TableCell>
            <TableCell> {unit.description ?? '-'} </TableCell>

            <TableCell align="right"> 
              <Button size="small" onClick={() => navigate(`/building/${details?.id}/units/${unit.id}`) }> {t('buttons.view')} </Button>
            </TableCell> 
            </TableRow> )) ) : 
            ( <TableRow> 
                <TableCell colSpan={10} align="center" sx={{ py: 4 }} > 
                  <Typography variant="body2" color="text.secondary" > {t('table.noData')} </Typography> 
                </TableCell> 
              </TableRow> )} 
          </TableBody> 
        </Table> 
      </TableContainer> 
    </Card>
  }
  
  const systemInformationSection = () => {
    return <Card sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        {t('building.details.system_information')}
      </Typography>

      <Grid container spacing={3}>
        {renderField(
          t('building.details.created_at'),
          details?.created_at
            ? format(new Date(details?.created_at), dateTimeFormat())
            : '-'
        )}

        {renderField(t('building.details.updated_by'), details?.updated_user_name)}
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
          onClick={() => navigate(`/building/${details?.id}/edit`)}
        >
          {t('building.details.edit_building')}
        </Button>
      </Stack>
    </Card>
  }


  return <MainContainer title={t(LANGUAGE + '.title')} roles={pageRoles}>
    {
      details
      ?
      <Box>
        {topSection()}
        {basicDataSection()}
        {technicalInformationSection()}
        {legalInformationSection()}
        {menagerSection()}
        {unitsSection()}
        {systemInformationSection()}
      </Box>
      :
      loading()
    }
    
    {/* <BlockPage isLoading={isLoading} /> */}
  </MainContainer>
}
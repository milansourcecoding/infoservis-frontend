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
import slice, { LANGUAGE, pageRoles, renderField } from './slice.tsx';

import { dateTimeFormat, formatCurrency, formatArea } from '../../utils/utils.tsx';
// import {  } from '../../utils/enums.tsx';


// ----------------------------------------------------------------------


export default function OrganizationDetailsPage() {
  const { t } = useLocales();
  const { id } = useParams();

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();


  const { isLoading, details } = useTypedSelector((state: RootState) => state.organizationSlice as any);


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
        <IconButton component={RouterLink} to={`/organization`}>
          <Icon icon="eva:arrow-ios-back-fill" />
        </IconButton>

        <Stack spacing={0.5}>
          <Stack spacing={1} direction="row" alignItems="center">
            <Typography variant="h4">{details?.name}</Typography>
          </Stack>
          <Typography variant="body2" sx={{ color: 'text.disabled' }}>{t('organization.details.title')}</Typography>
        </Stack>
      </Stack>

      <Stack direction="row" spacing={1}>
        <Button
          variant="contained"
          startIcon={<Icon icon="mingcute:add-line" />}
          onClick={() => navigate(`/organization/${details?.id}/employees/create`)}
        >
          {t('organization.details.add_employee')}
        </Button>

        <Button
          variant="outlined"
          startIcon={<Icon icon="mingcute:user-add-line" />}
          onClick={() => navigate(`/organization/${details?.id}/services/create`)}
        >
          {t('organization.details.add_service')}
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
          {t('organization.details.basic_information')}
        </Typography>

        <Label
          variant="soft"
          color={details?.is_active ? 'success' : 'error'}
        >
          {details?.is_active ? 'Active' : 'Inactive'}
        </Label>
      </Stack>

      <Grid container spacing={3}>
        {renderField(t('organization.details.name'), details?.name)}
        {renderField(t('organization.details.address'), details?.address)}
        {renderField(t('organization.details.city'), details?.city)}
        {renderField(t('organization.details.description'), details?.description)}
      </Grid>
    </Card>
  }
  
  const legalInformationSection = () => {
    return <Card sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        {t('organization.details.legal_information')}
      </Typography>

      <Grid container spacing={3}>
        {renderField(t('organization.details.pib'), details?.pib)}
        {renderField(t('organization.details.registration_number'), details?.registration_number)}
        {renderField(t('organization.details.bank_account'), details?.bank_account)}
        {renderField(t('organization.details.responsible_person'), details?.responsible_person)}
      </Grid>
    </Card>
  }


  const employeesSection = () => {
    return <Card sx={{ mb: 3 }}> 
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 3, pb: 2 }} > 
        <Typography variant="h6"> {t('organization.details.employees')}</Typography> 
        <Typography variant="body2" color="text.secondary">{(details && details.employees && details.employees.length > 0) ? details.employees.length : 0} </Typography> 
      </Stack> 
      <TableContainer> 
        <Table> 
          <TableHead> 
            <TableRow> 
              <TableCell> {t('organization.details.employee_name')} </TableCell>
            </TableRow> 
          </TableHead> 
          <TableBody> {(details && details.employees && details.employees.length > 0) ? ( details.employees.map((employee: any) => ( <TableRow key={employee.id} hover > 
            <TableCell> {employee.name ?? '-'} </TableCell>

            <TableCell align="right"> 
              <Button size="small" onClick={() => navigate(`/organization/${details?.id}/employees/${employee.id}`) }> {t('buttons.view')} </Button>
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


    const servicesSection = () => {
    return <Card sx={{ mb: 3 }}> 
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 3, pb: 2 }} > 
        <Typography variant="h6"> {t('organization.details.services')}</Typography> 
        <Typography variant="body2" color="text.secondary">{(details && details.services && details.services.length > 0) ? details.services.length : 0} </Typography> 
      </Stack> 
      <TableContainer> 
        <Table> 
          <TableHead> 
            <TableRow> 
              <TableCell> {t('organization.details.service_name')} </TableCell>
            </TableRow> 
          </TableHead> 
          <TableBody> {(details && details.services && details.services.length > 0) ? ( details.services.map((service: any) => ( <TableRow key={service.id} hover > 
            <TableCell> {service.name ?? '-'} </TableCell>

            <TableCell align="right"> 
              <Button size="small" onClick={() => navigate(`/organization/${details?.id}/services/${service.id}`) }> {t('buttons.view')} </Button>
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
        {t('organization.details.system_information')}
      </Typography>

      <Grid container spacing={3}>
        {renderField(
          t('organization.details.created_at'),
          details?.created_at
            ? format(new Date(details?.created_at), dateTimeFormat())
            : '-'
        )}

        {renderField(t('organization.details.updated_by'), details?.updated_user_name)}
      </Grid>

      <Divider sx={{ my: 3 }} />

      <Stack direction="row" spacing={1}>
        <Button
          variant="outlined"
          onClick={() => navigate('/organization')}
        >
          {t('organization.details.back_to_list')}
        </Button>

        <Button
          variant="contained"
          onClick={() => navigate(`/organization/${details?.id}/edit`)}
        >
          {t('organization.details.edit_organization')}
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
        {legalInformationSection()}
        {employeesSection()}
        {servicesSection()}
        {systemInformationSection()}
        
      </Box>
      :
      loading()
    }
    
    {/* <BlockPage isLoading={isLoading} /> */}
  </MainContainer>
}
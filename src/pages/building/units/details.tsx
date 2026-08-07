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
  Tab,
  Tabs,
  Hidden,
  Tooltip,
  MenuItem
} from '@mui/material';
import { Icon } from '@iconify/react';

// import { BlockPage } from 'src/components/block/block';
import MainContainer from 'src/components/container/MainContainer.tsx';
import Label from 'src/components/label';
import EmptyContent from 'src/components/empty-content';

import { current } from '@reduxjs/toolkit';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { RootState, AppDispatch, useTypedSelector } from '../../../utils/store.tsx';
import slice, { LANGUAGE, pageRoles, getUnitTypeLabel, getBillingTypeLabel, renderField } from './slice.tsx';

import { dateTimeFormat, formatCurrency, formatArea } from '../../../utils/utils.tsx';

import Form from './form.tsx';

// import {  } from '../../utils/enums.tsx';


// ----------------------------------------------------------------------


export default function UnitDetailsPage() {
  const { t } = useLocales();
  const { building_id , id} = useParams();

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

   const popover = usePopover();


  const { isLoading, details } = useTypedSelector((state: RootState) => state.unitSlice as any);


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
        <IconButton component={RouterLink} to={`/building/${building_id}`} state={{ activeTab: 'units' }} >
          <Icon icon="eva:arrow-ios-back-fill" />
        </IconButton>

        <Stack spacing={0.5}>
          <Stack spacing={1} direction="row" alignItems="center">
            <Typography variant="h4">{details?.name}</Typography>
          </Stack>
          <Typography variant="body2" sx={{ color: 'text.disabled' }}>{t('unit.details.title')}</Typography>
        </Stack>
      </Stack>

      <Stack direction="row" spacing={1}>
        <Button
          variant="outlined"
          onClick={() => navigate(
            `/building/${details?.building_id}`,
            {
              state: {
                activeTab: 'units',
              },
            }
          )}
        >
          {t('unit.details.back_to_list')}
        </Button>

      <Button
        variant="contained"
        onClick={onEditRow}
      >
        {t('unit.details.edit_unit')}
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
          {t('unit.details.basic_information')}
        </Typography>

        <Label
          variant="soft"
          color={details?.is_active ? 'success' : 'error'}
        >
          {details?.is_active ? 'Active' : 'Inactive'}
        </Label>
      </Stack>

      <Grid container spacing={3}>
        {renderField(t('unit.details.name'), details?.name)}
        {renderField(t('unit.details.unit_number'), details?.unit_number)}
        {renderField(t('unit.details.area'), formatArea(details?.area))}
        {renderField(t('unit.details.floor'), details?.floor)}
        {renderField(t('unit.details.unit_type'), getUnitTypeLabel(details?.unit_type, t))}
        {renderField(t('unit.details.owner'), details?.owner)}
        {renderField(t('unit.details.tenant'), details?.tenant)}
        {renderField(t('unit.details.description'), details?.description)}
      </Grid>
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
    </Card>
  }

  const buildingInfo = () => {
    return <Box>
        {basicDataSection()}
        {systemInformationSection()}
      </Box>
  }

    const billableServicesSection = () => {
      return <Card sx={{ mb: 3 }}> 
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 3, pb: 2 }} > 
          <Typography variant="h6"> {t('building.details.billable_services')}</Typography> 
          <Typography variant="body2" color="text.secondary">{(details && details.billable_services && details.billable_services.length > 0) ? details.billable_services.length : 0} </Typography> 
          <Button
            variant="contained"
            startIcon={<Icon icon="mingcute:add-line" />}
            onClick={() => navigate(`/building/${building_id}/units/${details?.id}/billable-services/create`)}
          >
            {t('building.details.add_billable_service')}
          </Button>
        </Stack> 
        <TableContainer> 
          <Table> 
            <TableHead> 
              <TableRow> 
                <TableCell> {t('building.billable_service.name')} </TableCell> 
                <TableCell> {t('building.billable_service.description')} </TableCell>
                <TableCell> {t('building.billable_service.billing_type')} </TableCell>
                <TableCell> {t('building.billable_service.quantity')} </TableCell>
                <TableCell> {t('building.billable_service.price')} </TableCell>
                <TableCell> {t('building.billable_service.unit_type')} </TableCell>
                <TableCell> {t('building.billable_service.start_date')} </TableCell>
                <TableCell> {t('building.billable_service.end_date')} </TableCell>
                <TableCell> {t('building.billable_service.created_at')} </TableCell>
                <TableCell> {t('building.billable_service.updated_at')} </TableCell>
                <TableCell> {t('building.billable_service.is_active')} </TableCell>
                <TableCell align="right"> {t('buttons.actions')} </TableCell>
              </TableRow> 
            </TableHead> 
            <TableBody> {(details && details.billable_services && details.billable_services.length > 0) ? ( details.billable_services.map((service: any) => ( <TableRow key={service.id} hover > 
              <TableCell> {service.name ?? '-'} </TableCell>
              <TableCell> {service.description ?? '-'} </TableCell>
              <TableCell> {getBillingTypeLabel(service.billing_type, t) ?? '-'}  </TableCell>
              <TableCell> {service.quantity ?? '-'} </TableCell>
              <TableCell> {service.price ?? '-'} </TableCell>
              <TableCell> {getUnitTypeLabel(service.unit_type, t) ?? '-'}  </TableCell>
              <TableCell> {service.start_date ?? '-'} </TableCell>
              <TableCell> {service.end_date ?? '-'} </TableCell>
              <TableCell> {service.created_at ?? '-'} </TableCell>
              <TableCell> {service.updated_at ?? '-'} </TableCell>
              <TableCell> {service.is_active ? t('building.billable_service.active') : t('building.billable_service.inactive')} </TableCell>
  
              <TableCell align="right"> 
                <Button size="small" onClick={() => navigate(`/building/${building_id}/units/${details?.id}/billable-services/${service.id}`) }> {t('buttons.view')} </Button>
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

    const onEditRow = () => {
        const unitId = id ? Number(id) : null;
        dispatch(
            slice.setShow({ show: true,  id: unitId, payload: null })
        )
    }

    const TABS = [
      {
        value: 'basic',
        label: t('building.details.basic_information'),
        icon: <Icon icon={'solar:user-id-bold'} width={24} />,
      },
      {
        value: 'billable_services',
        label: t('building.details.billable_services'),
        icon: <Icon icon={'solar:user-id-bold'} width={24} />,
      },
    ];

      const [currentTab, setCurrentTab] = React.useState('basic');
    
    
      const handleChangeTab = React.useCallback((event: any, newValue: any) => {
        setCurrentTab(newValue);
      }, []);


  return <MainContainer title={t(LANGUAGE + '.title')} roles={pageRoles}>
    {
      details
      ?
      <Box>
        {topSection()}
      </Box>
      
      :
      loading()
    }

        <Tabs
          value={currentTab}
          onChange={handleChangeTab}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        >
          {TABS.map((tab) => (
            <Tab key={tab.value} label={tab.label} icon={tab.icon} value={tab.value} />
          ))}
        </Tabs>

        {currentTab === 'basic' && buildingInfo()}
        {currentTab === 'billable_services' && billableServicesSection()}
        <Form
          onUpdate={() => {
            if (id) {
              dispatch(
                slice.callDetailsApi(
                  Number(id),
                  (_state: boolean, _data: any, _message: string) => {}
                )
              );
            }
          }}
    />
  </MainContainer>
}
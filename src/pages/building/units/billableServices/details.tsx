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

import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { RootState, AppDispatch, useTypedSelector } from '../../../../utils/store.tsx';
import slice, { LANGUAGE, pageRoles, getUnitTypeLabel, getBillingTypeLabel, renderField } from './slice.tsx';

import { dateTimeFormat, formatCurrency, formatArea } from '../../../../utils/utils.tsx';

import Form from './form.tsx';

// import {  } from '../../utils/enums.tsx';


// ----------------------------------------------------------------------


export default function UnitBillableServiceDetailsPage() {
  const { t } = useLocales();
  const { building_id , unit_id, id} = useParams();

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

   const popover = usePopover();


  const { isLoading, details } = useTypedSelector((state: RootState) => state.billableServiceSlice as any);


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
        <IconButton component={RouterLink} to={`/building/${building_id}`} state={{ activeTab: 'billable_services' }} >
          <Icon icon="eva:arrow-ios-back-fill" />
        </IconButton>

        <Stack spacing={0.5}>
          <Stack spacing={1} direction="row" alignItems="center">
            <Typography variant="h4">{details?.name}</Typography>
          </Stack>
          <Typography variant="body2" sx={{ color: 'text.disabled' }}>{t('billableService.details.title')}</Typography>
        </Stack>
      </Stack>

      <Stack direction="row" spacing={1}>
        <Button
          variant="outlined"
          onClick={() => navigate(
            `/building/${building_id}/units/${unit_id}`,
            {
              state: {
                activeTab: 'billable_services',
              },
            }
          )}
        >
          {t('billableService.details.back_to_list')}
        </Button>

      <Button
        variant="contained"
        onClick={onEditRow}
      >
        {t('billableService.details.edit_billable_service')}
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
        {renderField(t('billableService.details.name'), details?.name)}
        {renderField(t('billableService.details.unit_type'), getUnitTypeLabel(details?.unit_type, t))}
        {renderField(t('billableService.details.billing_type'), getBillingTypeLabel(details?.billing_type, t))}
        {renderField(t('billableService.details.quantity'), details?.quantity)}
        {renderField(t('billableService.details.price'), details?.price ? formatCurrency(details?.price) : '-')}
        {renderField(t('billableService.details.start_date'), details?.start_date ? format(new Date(details?.start_date), dateTimeFormat()) : '-')}
        {renderField(t('billableService.details.end_date'), details?.end_date ? format(new Date(details?.end_date), dateTimeFormat()) : '-')}
        {renderField(t('billableService.details.description'), details?.description)}
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
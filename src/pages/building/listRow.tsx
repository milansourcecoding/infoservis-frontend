/* eslint-disable eqeqeq */
/* eslint-disable prefer-template */
/* eslint-disable import/order */
/* eslint-disable no-nested-ternary */
import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { format } from 'date-fns';

// @mui
import {
  Stack,
  Avatar,
  Tooltip,
  TableRow,
  Checkbox,
  TableCell,
  IconButton,
  ListItemText,
  Hidden,
  MenuItem,
  Typography,
  Collapse,
  Divider,
  Paper,
  Card,
  Grid,
} from '@mui/material';
import { grey } from '@mui/material/colors';

// components
import Label from 'src/components/label';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { useBoolean } from 'src/hooks/use-boolean';

import { dateTimeFormat, formatCurrency, formatArea } from '../../utils/utils.tsx';
import { RemoveAction } from '../../utils/enums.tsx';


// Redux
import { useDispatch } from 'react-redux';
import { RootState, AppDispatch, useTypedSelector } from '../../utils/store.tsx';
import slice, { getFields, renderField } from './slice.tsx';
// import formSlice from '../../utils/slice/form/listSlice.tsx';
// import viewSlice from '../../utils/slice/form/viewSlice.tsx';
import removeSlice from '../../utils/slice/remove/removeSlice.tsx';
import { t } from 'i18next';

import { Link as RouterLink } from 'react-router-dom';
import Link from '@mui/material/Link';

// ----------------------------------------------------------------------

export default function ListRow({ row, isSelected, selected, onSelectRow }: any) {
  const popover = usePopover();
  const collapse = useBoolean();

  // const listSlice = useTypedSelector((state: RootState) => state.listSlice);
  const dispatch = useDispatch<AppDispatch>();


  const onEditRow = () => {
    dispatch(slice.setShow({ show: true, id: row.id, payload: null }))
  }
  const onRemoveRow = () => {
    dispatch(removeSlice.show({ type: RemoveAction.Delete, params: null, title: t('deletePopup.title'), text: t('deletePopup.question'), btn: t('buttons.remove'), ids: row.id, isBatch: false }))
  }


  return (
    <>
      <TableRow hover selected={selected} id={'row_' + row.id}
        // style={{ cursor: 'pointer' }}
        // onClick={(e) => {
        //   e.stopPropagation();
        //   e.preventDefault();

        //   onViewRow();
        // }}
      >
        <TableCell padding="checkbox"
          sx={{
            whiteSpace: "nowrap",
            position: "sticky",
            left: 0,
            zIndex: 1,
            backgroundColor: (selected || collapse.value) ? 'background.neutral' : 'white',
            borderRight: '1px solid #F4F6F8',
          }}
        >
          <Checkbox checked={selected}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();

              onSelectRow(e);
            }}
          />

          <IconButton
            color={collapse.value ? 'inherit' : 'default'}
            onClick={collapse.onToggle}
            sx={{
              ...(collapse.value && {
                bgcolor: 'action.hover',
              }),
            }}
          >
            <Icon icon={'eva:arrow-ios-downward-fill'} />
          </IconButton>
        </TableCell>

        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar alt={row?.name} sx={{ mr: 2, bgcolor: grey[400] }}>{(row?.name && row?.name.length > 0) ? row?.name[0] : ''}</Avatar>

          <ListItemText
            primary={
              <Link
                component={RouterLink}
                to={`/building/${row.id}`}
                color="inherit"
                underline="hover"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                {row?.name}
              </Link>
            }
            secondary={row?.city}
            primaryTypographyProps={{ typography: 'body2' }}
            secondaryTypographyProps={{
              component: 'span',
              color: 'text.disabled',
            }}
          />
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.pib}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.registration_number}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.bank_account}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{formatCurrency(row?.bank_ammount)}</TableCell>

        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          <ListItemText
            primary={row?.manager?.user?.name || ''}
            secondary={row?.manager?.user?.phone || ''}
            primaryTypographyProps={{ typography: 'body2' }}
            secondaryTypographyProps={{
              component: 'span',
              color: 'text.disabled',
            }}
          />
        </TableCell>

        <TableCell>
          <Label
            variant="soft"
            color={
              (row?.is_active && 'success') ||
              (!row?.is_active && 'error') ||
              'default'
            }
          >
            {row?.is_active ? t('buttons.active') : t('buttons.inactive')}
          </Label>
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <ListItemText
            primary={(row?.created_at) ? format(new Date(row?.created_at), dateTimeFormat()) : ''}
            secondary={row?.updated_user_name}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: 'span',
              typography: 'caption',
            }}
          />
        </TableCell>


        <TableCell align="right"
          sx={{
            px: 1,
            whiteSpace: 'nowrap',
            position: "sticky",
            right: 0,
            zIndex: 1,
            backgroundColor: selected ? '#f5faf9' : 'white',
            borderLeft: '1px solid #F4F6F8',
          }}
        >
          <Hidden mdDown>
            <Tooltip title={t('buttons.edit')} placement="top" arrow>
              <IconButton
                disabled={isSelected}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();

                  onEditRow();
                }}
              >
                <Icon icon={'solar:pen-bold'} />
              </IconButton>
            </Tooltip>

            <Tooltip title={t('buttons.remove')} placement="top" arrow>
              <IconButton color={'default'}
                disabled={isSelected}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();

                  onRemoveRow();
                }}
              >
                <Icon icon={'material-symbols:cancel'} />
              </IconButton>
            </Tooltip>
          </Hidden>

          <Hidden mdUp>
            <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
              <Icon icon={'eva:more-vertical-fill'} />
            </IconButton>
            <CustomPopover
              open={popover.open}
              onClose={popover.onClose}
              arrow="right-top"
              sx={{ width: 150 }}
              hiddenArrow={undefined}
            >
              <MenuItem
                disabled={isSelected}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();

                  onEditRow()

                  popover.onClose();
                }}
              >
                <>
                  <Icon icon={'solar:pen-bold'} />
                  {t('buttons.edit')}
                </>
              </MenuItem>

              <MenuItem
                disabled={isSelected}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();

                  onRemoveRow();

                  popover.onClose();
                }}
              >
                <>
                  <Icon icon={'material-symbols:cancel'} />
                  {t('buttons.remove')}
                </>
              </MenuItem>
            </CustomPopover>
          </Hidden>
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell sx={{ p: 0, border: 'none' }} colSpan={10}>
          <Collapse
            in={collapse.value}
            timeout="auto"
            unmountOnExit
            sx={{ bgcolor: 'background.neutral' }}
          >
            <Divider />
  
            <Stack component={Paper} sx={{ m: 1.5, p: 1.5 }}>
              <Grid container spacing={3}>
                {renderField(t('building.details.address'), row?.address, { xs: 12, sm: 6, md: 3 })}
                {renderField(t('building.details.city'), row?.city, { xs: 12, sm: 6, md: 3 })}
                {renderField(t('building.details.description'), row?.description, { xs: 12, sm: 6, md: 6 })}
              </Grid>
            </Stack>
            
            <Stack component={Paper} sx={{ m: 1.5, p: 1.5 }}>
              <Grid container spacing={3}>
                {renderField(t('building.details.units_number'), row?.units_number, { xs: 12, sm: 6, md: 3 })}
                {renderField(t('building.details.area'), formatArea(row?.area), { xs: 12, sm: 6, md: 3 })}
                {renderField(t('building.details.year_of_construction'), row?.year_of_construction, { xs: 12, sm: 6, md: 3 })}
                {renderField(t('building.details.number_of_floors'), row?.number_of_floors, { xs: 12, sm: 6, md: 3 })}
                {renderField(t('building.details.number_of_elevators'), row?.number_of_elevators, { xs: 12, sm: 6, md: 3 })}
                {renderField(t('building.details.roof_type'), row?.roof_type, { xs: 12, sm: 6, md: 3 })}
                {renderField(t('building.details.lightning_rod'), 
                  <Label
                    variant="soft"
                    color={row?.lightning_rod ? 'info' : 'default'}
                  >
                  {row?.lightning_rod ? t('buttons.yes') : t('buttons.no')}
                  </Label>, 
                  { xs: 12, sm: 6, md: 3 })
                }
                {renderField(t('building.details.shelter'), 
                  <Label
                    variant="soft"
                    color={row?.shelter ? 'info' : 'default'}
                  >
                  {row?.shelter ? t('buttons.yes') : t('buttons.no')}
                  </Label>, 
                  { xs: 12, sm: 6, md: 3 })
                }
                {renderField(t('building.details.remote_heating'), 
                  <Label
                    variant="soft"
                    color={row?.remote_heating ? 'info' : 'default'}
                  >
                  {row?.remote_heating ? t('buttons.yes') : t('buttons.no')}
                  </Label>, 
                  { xs: 12, sm: 6, md: 3 })
                }
                {renderField(t('building.details.parking'), 
                  <Label
                    variant="soft"
                    color={row?.parking ? 'info' : 'default'}
                  >
                  {row?.parking ? t('buttons.yes') : t('buttons.no')}
                  </Label>, 
                  { xs: 12, sm: 6, md: 3 })
                }
              </Grid>
            </Stack>

          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

ListRow.propTypes = {
  onSelectRow: PropTypes.func,
  row: PropTypes.object,
  isSelected: PropTypes.bool,
  selected: PropTypes.bool
};

/* eslint-disable eqeqeq */
/* eslint-disable prefer-template */
/* eslint-disable import/order */
import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { format } from 'date-fns';

// @mui
// import Box from '@mui/material/Box';
// import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import Hidden from '@mui/material/Hidden';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Switch from '@mui/material/Switch';

// components
import Label from 'src/components/label';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

import { dateTimeFormat } from '../../../utils/utils.tsx';
import { RemoveAction } from '../../../utils/enums.tsx';

// Redux
import { useDispatch } from 'react-redux';
import { RootState, AppDispatch, useTypedSelector } from '../../../utils/store.tsx';
import slice, { API, LANGUAGE } from './reduxSlice.tsx';
// import radniNalogSlice from '../radniNalog/reduxSlice.tsx';
import formReduxSlice from '../../../utils/slice/form/listSlice.tsx';
import viewSlice from '../../../utils/slice/form/viewSlice.tsx';
import removeSlice from '../../../utils/slice/remove/removeSlice.tsx';
import { t } from 'i18next';

// ----------------------------------------------------------------------

export default function ListRow({ row, selected, onSelectRow }: any) {
  const popover = usePopover();

  // const listSlice = useTypedSelector((state: RootState) => state.listSlice);
  const dispatch = useDispatch<AppDispatch>();

  const [isDef, setDef] = React.useState(row?.isDefault);


  const onAction = (checked: boolean) => {
    dispatch(slice.calSetDefaultApi(row.id, () => {
      window.location.reload();
    }));
  }
  const onEditRow = () => {
    dispatch(slice.setShow({ show: true, id: row.id, payload: null }))
  }
  const onRemoveRow = () => {
    dispatch(removeSlice.show({ type: RemoveAction.Delete, params: null, title: t('deletePopup.title'), text: t('deletePopup.question'), btn: t('buttons.remove'), ids: row.id, isBatch: false }))
  }


  return (
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
          backgroundColor: selected ? '#f5faf9' : 'white',
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
      </TableCell>

      {/* <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar variant={'rounded'} sx={{ mr: 2, width: 56, height: 56, bgcolor: '#F4F6F8', border: '1px solid #c4c4c4' }}>
          <Box display={'block'} textAlign={'center'}>
            <Typography variant="subtitle2" color={'black'}>Sep</Typography>
            <Typography variant="subtitle1" color={'black'}>30</Typography>
          </Box>
        </Avatar>

        {naziv}
      </TableCell> */}

      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        <Typography variant={'subtitle2'}>{row?.naziv}</Typography>
      </TableCell>
      {/* <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.naziv}</TableCell> */}

      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        <Switch
          disabled={row?.isDefault}
          checked={isDef}
          onChange={(event) => {
            setDef(event.target.checked);
            onAction(event.target.checked);
          }}
        />
      </TableCell>

      <TableCell>
        <Label
          variant="soft"
          color={row?.isNaplativ ? 'info' : 'default'}
        >
        {row?.isNaplativ ? t('buttons.yes') : t('buttons.no')}
        </Label>
      </TableCell>

      <TableCell>
        <Label
          variant="soft"
          color={
            (row?.isActive && 'success') ||
            (!row?.isActive && 'error') ||
            'default'
          }
        >
          {row?.isActive ? t('buttons.active') : t('buttons.inactive')}
        </Label>
      </TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        <ListItemText
          primary={format(new Date(row?.updated_at), dateTimeFormat())}
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
              <IconButton color={'default'}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();

                  onEditRow()
                }}
              >
                <Icon icon={'solar:pen-bold'} />
              </IconButton>
            </Tooltip>

            <Tooltip title={t('buttons.remove')} placement="top" arrow>
              <IconButton color={'default'}
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
  );
}

ListRow.propTypes = {
  onSelectRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool
};

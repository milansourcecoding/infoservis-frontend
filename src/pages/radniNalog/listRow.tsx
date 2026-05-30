/* eslint-disable eqeqeq */
/* eslint-disable prefer-template */
/* eslint-disable import/order */
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { format } from 'date-fns';

// @mui
// import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import Hidden from '@mui/material/Hidden';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { grey } from '@mui/material/colors';

// components
import Label from 'src/components/label';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

import { dateTimeFormat, getStatusDokumenta, getColorStatusDokumenta, formatNumber, formatMinToHours } from '../../utils/utils.tsx';
import { RemoveAction, StatusDokumenta } from '../../utils/enums.tsx';

// Redux
import { useDispatch } from 'react-redux';
import { RootState, AppDispatch, useTypedSelector } from '../../utils/store.tsx';
import slice, { API, LANGUAGE } from './reduxSlice.tsx';
import formReduxSlice from '../../utils/slice/form/listSlice.tsx';
import viewSlice from '../../utils/slice/form/viewSlice.tsx';
import removeSlice from '../../utils/slice/remove/removeSlice.tsx';
import { t } from 'i18next';

// ----------------------------------------------------------------------

export default function ListRow({ row, selected, onSelectRow }: any) {
  const popover = usePopover();

  const listSlice = useTypedSelector((state: RootState) => state.listSlice);
  const dispatch = useDispatch<AppDispatch>();


  const onAction = () => {

  }
  const onEditRow = () => {
    dispatch(slice.setShow({ show: true, id: row.id, payload: null }))
  }
  const onRemoveRow = () => {
    dispatch(removeSlice.show({ type: RemoveAction.Storniraj, params: null, title: t('stornirajPopup.title'), text: t('stornirajPopup.question'), btn: t('buttons.storniraj'), ids: row.id, isBatch: true }))
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

      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        <Typography variant={'subtitle2'}>{row?.brojDokumenta}</Typography>
      </TableCell>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.napomena || '-'}</TableCell>


      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        {(row?.radnici && row?.radnici.length > 0) && <Tooltip title={row?.radnici.map((x: any) => <div>{x?.name}</div>)} placement="top" arrow>
          <AvatarGroup max={3} spacing={30}>
            {row?.radnici.map((itm: any, i: number) => <Avatar
                key={'row_' + row.id + '_radnik_' + i}
                // src={getUserLogo(itm?.logo, VelicinaSlike.Mala)?.toString()}
                alt={itm?.name}
                sx={{ mr: 2, bgcolor: grey[400] }}
              >
                {itm?.name.charAt(0).toUpperCase()}
              </Avatar>)}
          </AvatarGroup>
        </Tooltip>}
      </TableCell>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>{formatMinToHours(row?.brojRadnihSatiPoRadniku) || '-'}</TableCell>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>{formatNumber(row?.cenaRadnogSataIzUgovora) || '-'}</TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.liftNaziv || '-'}</TableCell>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.kategorijaNaziv || '-'}</TableCell>

      <TableCell>
        <Label
          variant="soft"
          color={getColorStatusDokumenta(row?.status)}
        >
          {getStatusDokumenta(row?.status)}
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
            {/* {(row?.status === StatusDokumenta.Processing) && <Tooltip title={t(LANGUAGE + '.buttons.action')} placement="top" arrow>
              <IconButton color={'info'}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();

                  onAction()
                }}
              >
                <Icon icon={'entypo:flash'} />
              </IconButton>
            </Tooltip>} */}

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

            {
            (row?.status != StatusDokumenta.Storniran && row?.status != StatusDokumenta.Zavrsen)
            ?
            <Tooltip title={t('buttons.storniraj')} placement="top" arrow>
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
            :
            (listSlice.status != StatusDokumenta.Storniran && listSlice.status != StatusDokumenta.Zavrsen) && <div style={{ position: 'relative', display: 'inline-flex',  width: '40px' }}>&nbsp;</div>
            }
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
            {/* {(row?.status === StatusDokumenta.Processing) && <MenuItem
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();

                onAction()

                popover.onClose();
              }}
            >
              <>
                <Icon icon={'entypo:flash'} />
                {t(LANGUAGE + '.buttons.action')}
              </>
            </MenuItem>} */}

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

            {(row?.status != StatusDokumenta.Storniran && row?.status != StatusDokumenta.Zavrsen) && <MenuItem
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();

                onRemoveRow();

                popover.onClose();
              }}
            >
              <>
                <Icon icon={'material-symbols:cancel'} />
                {t('buttons.storniraj')}
              </>
            </MenuItem>}

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

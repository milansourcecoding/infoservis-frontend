/* eslint-disable no-else-return */
/* eslint-disable no-lonely-if */
/* eslint-disable arrow-body-style */
/* eslint-disable react/jsx-boolean-value */
import React from 'react';
import moment from 'moment';
import useMediaQuery from '@mui/material/useMediaQuery';

import Popover from '@mui/material/Popover';
import Button from '@mui/material/Button';
import { Icon } from '@iconify/react';

import { DateRangePicker, DefinedRange } from 'react-date-range';
import { enGB } from 'date-fns/locale';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

import { dateViewFormat, getDateRanges } from '../../utils/utils.tsx';

// ----------------------------------------------------------------------


const RangePicker = React.forwardRef(({ placeholder = 'Select dates', fromDate, toDate, onApply, ...props }: any, ref: any) => {
    const isMobile = useMediaQuery('(max-width:600px)');

    const [text, setText] = React.useState();

    const [ranges, setRanges] = React.useState<any>([
        {
            startDate: moment(fromDate).toDate() || moment().startOf('isoWeek').toDate(),
            endDate: moment(toDate).toDate() || moment().endOf('isoWeek').toDate(),
            key: 'selection'
        }
    ]);

    
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    
    React.useImperativeHandle(
        ref,
        () => ({
            hide() {
                // setOpen(false);
            },
        }),
    );


    React.useEffect(() => {
        setRanges([
            {
                startDate: moment(fromDate).toDate() || moment().startOf('isoWeek').toDate(),
                endDate: moment(toDate).toDate() || moment().endOf('isoWeek').toDate(),
                key: 'selection'
            }
        ]);
    }, [fromDate, toDate]);

    React.useEffect(() => {
        setText(getText())
    }, [ranges]);


    const getText = () => {
        if(ranges && ranges.length > 0){
            if((ranges[0].startDate != null) && ranges[0].endDate != null){
                return `${moment(ranges[0].startDate).format(dateViewFormat())} - ${moment(ranges[0].endDate).format(dateViewFormat())}`;
            } else {
                if(ranges[0].startDate != null){
                    return moment(ranges[0].startDate).format(dateViewFormat())
                } else if(ranges[0].endDate != null){
                    return moment(ranges[0].endDate).format(dateViewFormat())
                } else {
                    return placeholder;
                }
            }
        } else {
            return placeholder;
        }
    };

    const getPicker = () => {
        if(isMobile){
            return <DefinedRange 
                ranges={ranges} 
                retainEndDateOnFirstSelection={true}
                renderStaticRangeLabel={(p: any) => {
                    return <>{p.label}</>
                }}
                onChange={(item: any) => {
                    setRanges([item.selection]);
                }}
                staticRanges={getDateRanges([])}
                locale={enGB}
                direction={isMobile ? 'vertical' : 'horizontal'}
                months={isMobile ? 1 : 2}
                showSelectionPreview
                moveRangeOnFirstSelection={false}
                showDateDisplay={false}
                {...props }
            />
        } else {
            return <DateRangePicker 
                ranges={ranges} 
                retainEndDateOnFirstSelection={true}
                renderStaticRangeLabel={(p: any) => {
                    return <>{p.label}</>
                }}
                onChange={(item: any) => {
                    setRanges([item.selection]);
                }}
                staticRanges={getDateRanges([])}
                locale={enGB}
                direction={isMobile ? 'vertical' : 'horizontal'}
                months={isMobile ? 1 : 2}
                showSelectionPreview
                moveRangeOnFirstSelection={false}
                showDateDisplay={false}
                {...props }
            />
        }
    };
    

    return <div>
        <Button 
            aria-describedby={id}
            variant="outlined"
            color='inherit'
            onClick={handleClick}
            style={{
                backgroundColor: 'transparent',
                border: '1px solid #919eab33',
                fontWeight: '600'
            }}
        >
            <span style={{ paddingRight: '10px' }}>{text}</span>
            <Icon icon={'mdi:calendar'} width={22} />
        </Button>
        <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
        >
            <>
                <div>{getPicker()}</div>
                <div style={{ textAlign: 'right', padding: '10px' }}>
                    <Button 
                        variant="contained"
                        color='inherit'
                        size='small'
                        onClick={(e: any) => {
                            e.preventDefault();
                            e.stopPropagation();

                            if(onApply){
                                onApply(ranges);
                            }

                            handleClose();
                        }}
                    >
                        Ok
                    </Button>
                </div>
            </>
        </Popover>
    </div>
  });
  

  export default RangePicker;
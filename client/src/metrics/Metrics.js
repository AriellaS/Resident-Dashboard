import * as S from '~/metrics/styles';
import Navbar from '~/shared/Navbar';
import { useState, useMemo, useEffect } from 'react';
import {
  MantineReactTable,
  useMantineReactTable,
} from 'mantine-react-table';
import { DatePicker } from 'rsuite';
import ajax from '~/util';

const Metrics = () => {

    const defaultStartDate = new Date(Date.now() - 30*24*60*60*1000); // 30 days ago
    const defaultEndDate = new Date();

    const columns = useMemo(() => [
        {
            accessorKey: 'fullname',
            header: 'Name',
            size: 60,
        }, {
            accessorKey: 'evalCount',
            header: 'Total Completed',
            enableGlobalFilter: false,
            size: 40,
        }, {
            accessorKey: 'evalPercent',
            header: '% Completion',
            enableGlobalFilter: false,
            size: 40,
        }
    ], []);

    const [data, setData] = useState([]);
    const [formState, setFormState] = useState({
        startDate: defaultStartDate,
        endDate: defaultEndDate,
    });

    const table = useMantineReactTable({
        columns,
        data,
        enableColumnActions: false,
        enableColumnFilters: false,
        enableColumnDragging: false,
        enableHiding: false,
        enableResizing: false,
        enableDensityToggle: false,
        enableFullScreenToggle: false,
        enableFilterMatchHighlighting: false,
        layoutMode: 'grid',
        initialState: {
            sorting: [{
                id: 'evalCount',
                desc: true,
            }],
        },
    });

    useEffect(() => {
        const startDate = formState.startDate ? formState.startDate.toISOString() : new Date(0);
        const endDate = formState.endDate ? formState.endDate.toISOString() : new Date();
        async function fetchData() {
            await ajax.request('get', `/metrics?startDate=${startDate}&endDate=${endDate}`)
                .then(res => {
                const data = res.data.metrics.map(({ firstname, lastname, evalCount, incompleteRequestCount }) => ({
                    fullname: `${lastname}, ${firstname}`,
                    evalCount,
                    evalPercent: evalCount + incompleteRequestCount > 0 ? `${Math.round((100*evalCount)/(evalCount+incompleteRequestCount))}%` : null
                }));
                setData(data);
            }).catch(err => {
                console.log(err);
            });
        }
        fetchData();
    }, [formState]);

    return (
        <S.ScreenContainer>
            <Navbar />
            <S.Container>
            <S.DateRangeContainer>
                <S.DateSelectContainer>
                    Start Date
                    <DatePicker
                        oneTap
                        defaultValue={formState.startDate}
                        onChange={e => setFormState({...formState, startDate: e})}
                        format='MM/dd/yyyy'
                    />
                </S.DateSelectContainer>
                <S.DateSelectContainer>
                    End Date
                    <DatePicker
                        oneTap
                        defaultValue={formState.endDate}
                        onChange={e => setFormState({...formState, endDate: e})}
                        format='MM/dd/yyyy'
                    />
                </S.DateSelectContainer>
            </S.DateRangeContainer>
                <MantineReactTable table={table} />
            </S.Container>
        </S.ScreenContainer>
    )
}

export default Metrics;

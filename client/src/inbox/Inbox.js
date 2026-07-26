import Navbar from '~/shared/Navbar';
import {
  MantineReactTable,
  useMantineReactTable,
} from 'mantine-react-table';
import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as S from '~/inbox/styles';
import ajax from '~/util';

const Inbox = ({ currentUser }) => {

    const [data, setData] = useState([]);
    const navigate = useNavigate();

    const columns = useMemo(() => [
        {
            accessorKey: 'date',
            header: 'Date Requested',
            size: 20,
        }, {
            accessorKey: 'evaluatee',
            header: 'Name',
            size: 40,
        }, {
            accessorKey: 'note',
            header: 'Note',
            enableGlobalFilter: false,
            enableSorting: false,
            size: 60,
        }
    ], []);

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
        mantinePaginationProps: {
            showRowsPerPage: false,
            rowsPerPage: 20,
        },
        initialState: {
            sorting: [{
                id: 'date',
                desc: true,
            }],
        },
        localization: {
            noRecordsToDisplay: "You have no pending requests!",
        },
        mantineTableBodyRowProps: ({ row }) => ({
            onClick: () => {
                navigate(`/users/${row.original.evaluateeId}/eval?evalRequestId=${row.original.id}`);
            },
            sx: {
                cursor: 'pointer',
            },
        }),
    });

    useEffect(() => {
        async function fetchData() {
            await ajax.request('get', `/users/id/${currentUser._id}/evalrequest`)
                .then(res => {
                    const data = res.data.map(({ evaluatee, note, createdAt, _id}) => ({
                        date: new Date(createdAt).toLocaleDateString('en-US'),
                        evaluatee: `${evaluatee.lastname}, ${evaluatee.firstname}`,
                        evaluateeId: evaluatee._id,
                        note,
                        id: _id,
                    }));
                    setData(data);
                }).catch(err => {
                    console.log(err);
                });
        }
        fetchData();
    }, [currentUser]);

    return (
        <S.ScreenContainer>
            <Navbar />
            <S.Header>Evaluation Requests</S.Header>
            <MantineReactTable table={table} />
        </S.ScreenContainer>
    )
}

export default Inbox;

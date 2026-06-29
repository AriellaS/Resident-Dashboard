import { useState, useEffect } from 'react';
import * as S from '~/home/styles';
import UserSearchDropdown from '~/home/UserSearchDropdown';
import Navbar from '~/shared/Navbar';

import ajax from '~/util';

const Home = ({ currentUser }) => {

    const [queryState, setQueryState] = useState('');
    const [searchFocus, setSearchFocus] = useState(false);
    const [allUserData, setAllUserData] = useState([]);
    const [queriedUserData, setQueriedUserData] = useState([]);

    const roleToSearch = currentUser.role==='FACULTY' ? 'RESIDENT' : 'FACULTY';

    const handleSearchBarFocus = () => {
        setSearchFocus(true);
    }

    const handleSearchBarFocusOut = () => {
        //setSearchFocus(false);
    }

    const handleSearchBarChange = async(e) => {
        let query = e.target.value;
        setQueryState(query);
        let re = new RegExp(`^${String(query).trim().replace(/\s/g, "|")}`, "ig");
        let queriedData = allUserData.filter(u => u.firstname.match(re) || u.lastname.match(re));
        setQueriedUserData(queriedData);
    }

    useEffect(() => {
        async function fetchData() {
            await ajax.request('get', `/users?role=${roleToSearch}`)
            .then(res => {
                let data = res.data.filter(u => !u.hidden);
                setAllUserData(data);
                setQueriedUserData(data);
            }).catch(err => {
                console.log(err);
            });
        }
        fetchData();
    }, [roleToSearch]);

    return (
        <S.ScreenContainer>
            <Navbar />
            <S.CenterScreenContainer>
                <S.SearchContainer>
                    <S.SearchBar
                        placeholder={`Search ${roleToSearch.toLowerCase()}${roleToSearch==='RESIDENT'?'s':''}...`}
                        value={queryState}
                        onFocus={handleSearchBarFocus}
                        onBlur={handleSearchBarFocusOut}
                        onChange={e => {handleSearchBarChange(e)}}
                    />
                    {searchFocus && <UserSearchDropdown users={queriedUserData.sort((a,b) => a.pgy - b.pgy)} /> }
                </S.SearchContainer>
            </S.CenterScreenContainer>
        </S.ScreenContainer>
    )
};

export default Home;

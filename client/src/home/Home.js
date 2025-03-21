import { useState } from 'react';
import * as S from '~/home/styles';
import UserSearchDropdown from '~/home/UserSearchDropdown';
import Navbar from '~/shared/Navbar';

import ajax from '~/util';

const Home = () => {

    const [queryState, setQueryState] = useState('');
    const [searchResultState, setSearchResultState] = useState([]);

    const handleSearch = async(e) => {
        let query = e.target.value;
        setQueryState(query)
        if (query) {
            await ajax.request('get', `/users/search?q=${query}`)
                .then(res => {
                    setSearchResultState(res.data);
                }).catch(err => {
                    console.log(err);
                });
        } else {
            setSearchResultState([]);
        }
    }

    return (
        <S.CenterScreenContainer>
            <Navbar />
            <S.SearchContainer>
                <S.SearchBar
                    placeholder="Search users..."
                    value={queryState}
                    onChange={e => {handleSearch(e)}}
                />
                <UserSearchDropdown users={searchResultState} />
            </S.SearchContainer>
        </S.CenterScreenContainer>
    )
};

export default Home;

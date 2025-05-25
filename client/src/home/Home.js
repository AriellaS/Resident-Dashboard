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
        await ajax.request('get', `/users/search?q=${query}`)
            .then(res => {
                setSearchResultState(res.data);
            }).catch(err => {
                console.log(err);
            });
    }

    return (
        <S.ScreenContainer>
            <Navbar />
            <S.CenterScreenContainer>
                <S.SearchContainer>
                    <S.SearchBar
                        placeholder="Search users..."
                        value={queryState}
                        onClick={e => {handleSearch(e)}}
                        onChange={e => {handleSearch(e)}}
                    />
                    <UserSearchDropdown users={searchResultState} />
                </S.SearchContainer>
            </S.CenterScreenContainer>
        </S.ScreenContainer>
    )
};

export default Home;

import * as S from '~/home/styles';

const UserSearchDropdown = (props) => {
    return (
        <S.StyledListGroup variant='light'>
            {props.users.map((user) => {
                return (
                    <S.StyledListGroupItem
                        key={user._id}
                        action
                        href={`/users/${user._id}`}
                        active={false}
                    >
                        <S.SearchText_Name>{`${user.firstname} ${user.lastname}`}</S.SearchText_Name>
                        <S.SearchText_Pgy>{`(PGY-${user.pgy})`}</S.SearchText_Pgy>
                    </S.StyledListGroupItem>
                )
            })}
        </S.StyledListGroup>
    )
};

export default UserSearchDropdown;

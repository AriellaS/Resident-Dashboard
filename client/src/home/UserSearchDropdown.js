import ListGroup from 'react-bootstrap/ListGroup';
import * as S from '~/home/styles';

const UserSearchDropdown = (props) => {
    return (
        <S.StyledListGroup variant='light'>
            {props.users.map((user) => {
                return (
                    <ListGroup.Item
                        key={user._id}
                        action
                        href={`/users/${user._id}`}
                        active={false}
                    >
                        {`${user.firstname} ${user.lastname} (${user.role})`}
                    </ListGroup.Item>
                )
            })}
        </S.StyledListGroup>
    )
};

export default UserSearchDropdown;

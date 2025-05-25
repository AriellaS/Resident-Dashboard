import ListGroup from 'react-bootstrap/ListGroup';

const UserSearchDropdown = (props) => {
    return (
        <ListGroup variant='light'>
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
        </ListGroup>
    )
};

export default UserSearchDropdown;

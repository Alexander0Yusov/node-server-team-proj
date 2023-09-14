let users = [];

const findUser = user => {
  const userName = user.name;
  const userRoom = user.room;
  const userAvatar = user.avatar;
  return users.find(
    user =>
      user.name === userName &&
      user.room === userRoom &&
      user.avatar === userAvatar
  );
};

const addUser = user => {
  const isExist = findUser(user);
  !isExist && users.push(user);
  const currentUser = isExist || user;
  return { isExist: !!isExist, user: currentUser };
};

const getRoomsUsers = room =>
  users.filter(user => user.room === room);

const removeUser = user => {
  const found = findUser(user);

  
  if (found) {
    users = users.filter(
      ({ room, name, avatar }) =>
        room === found.room && 
        name !== found.name &&
        avatar === found.name

    );
  }
  return found;
};

module.exports = {
  addUser,
  findUser,
  getRoomsUsers,
  removeUser,
};

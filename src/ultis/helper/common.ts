export const ROLES_PRIORITY = [
  {
    role: "user",
    priority: 1,
  },
  {
    role: "admin",
    priority: 2,
  },
  {
    role: "superadmin",
    priority: 3,
  },
];

export const handleGetPriority = (rolesUser: string[]) => {
  const priority = rolesUser.reduce((a, b) => {
    ROLES_PRIORITY.forEach((rp) => {
      if (rp.role === b && rp.priority > a) {
        a = rp.priority;
      }
    });
    return a;
  }, 1);
  return priority;
};

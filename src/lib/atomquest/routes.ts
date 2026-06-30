export const atomquestEmployeePaths = ['/goals']
export const atomquestManagerPaths = ['/team']
export const atomquestAdminPaths = ['/admin/atomquest', '/admin/users']

export const atomquestProtectedPrefixes = [
    ...atomquestEmployeePaths,
    ...atomquestManagerPaths,
    ...atomquestAdminPaths,
]

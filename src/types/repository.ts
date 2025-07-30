export type Data = {
    agents: Agent[]
}

export type Agent = {
    id: string
    name: string
    type: 'Sales' | 'Support' | 'Marketing'
    status: 'Active' | 'Inactive'
    description?: string
}
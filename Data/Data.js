export let users = [
    {username: 'admin', password: 'admin', isAdmin: true},
    {username: 'temp', password: 'temp', isAdmin: false}
];

export let userHistory = [
    {name: '10:00 – Going to the gym (temp)', height: 12463452, day: '2024-05-13'},
    {name: '17:00 – Cooking some meal (temp)', height: 0, day: '2024-05-13'},
    {name: '20:00 – Eating some chips (admin)', height: 255 * 255 * 255, day: '2024-05-13'}
];

export const corsOptions = {
    origin: '*',
    methods: 'GET, POST, PUT, DELETE'
};
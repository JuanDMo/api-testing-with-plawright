import { expect, test } from '@playwright/test';
import  logIn from '../requests/log_in.ts';
import generateUpdateInfoRequest from '../requests/update_user.ts';
import adminRequest from '../test_data/admin.json';

let token: string;

let headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
}

test.describe.configure({ mode: 'serial' });

test.beforeAll( async ({ request }) => {
    console.log('-------- Befote Test ----------');
    //const loginRequest = logIn();

    const response = await request.post('/auth', {
        headers: headers,
        data: adminRequest
    });

    const statusCode = response.status();
    const body = await response.json();
    token = 'token=' + body.token;

    console.log('Logs Login:');
    console.log('Status Code: ', statusCode);
    console.log('Body: ', body);
    console.log('Token: ', token);

    expect(statusCode).toBe(200);
});

test.describe('Suite de pruebas a nivel de API para los servicios de la API Restful Booker', () => {

    test('Test para obtener la informacion del 1 booking - @Regression1', async ( { request } ) => {
        const bookerId = 1;

        const response = await request.get('/booking/'+bookerId, {
            headers: headers
        });

        const statusCode = response.status();
        const body = await response.json();

        expect(statusCode).toBe(200);
        expect(body).toHaveProperty('totalprice');
        
        console.log('Logs - Test de Get')
        console.log('Status Code => ', statusCode);
        console.log('Body => ', body);
    });

    test('@Regression Test para actualizar la informacion del 1 booking - @Regression2', async ( { request } ) => {
        const bookerId = 1;
        const updateInfoRequest = generateUpdateInfoRequest();

        console.log('Test de ACTUALIZAR - Token ', token);
        const headersWithToken = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Cookie': `${token}`
        }
        
        console.log('Headers - Update Method ', headersWithToken);

        const response = await request.put('/booking/'+bookerId, {
            headers: headersWithToken,
            data: updateInfoRequest
        });

        const statusCode = response.status();
        const body = await response.json();

        console.log('Status Code => ', statusCode);
        console.log('Body => ', body);

        expect(statusCode).toBe(200);
        expect(body).toHaveProperty('totalprice', updateInfoRequest.totalprice);
    });

    test('@Regression - Test para la eliminación de un recurso - @Regression3', async ({ request } ) => {
        const bookerId = 1;

        const headersWithToken = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Cookie': `${token}`
        }
        
        console.log('Headers ', headersWithToken);
        const response = await request.delete('/booking/'+bookerId, {
            headers: headersWithToken
        });

        const statusCode = response.status();
        //const body = await response.statusText();

        console.log('Status Code => ', statusCode);
        console.log('Body => ', response.statusText());

        expect(statusCode).toBe(201);
    }); 
});
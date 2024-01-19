import { expect, test } from '@playwright/test';
import  logIn from '../requests/log_in.ts';
import generateUpdateInfoRequest from '../requests/update_user.ts';

test.describe('Suite de pruebas a nivel de API para los servicios de la API Restful Booker', () => {

    let headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }

    let token: String;

    test.beforeEach(async ({ request }) => {
        const loginRequest = logIn();

        const response = await request.post('/auth', {
            headers: headers,
            data: loginRequest
        });

        const statusCode = response.status();
        const body = await response.json();
        token = 'token=' + body.token;

        console.log('Logs Login:');
        console.log('Status Code: ', statusCode);
        console.log('Body: ', body);

        expect(statusCode).toBe(200);
    });

    /*
    test('Test de autenticacion ', async ( { request } ) => {

        const loginRequest = logIn();

        const response = await request.post('/auth', {
            headers: headers, 
            data: loginRequest
        });

        const statusCode = response.status();
        const body = await response.json();

        expect(statusCode).toBe(200);

        console.log('Token => ', token);
        console.log('Status Code => ', statusCode);
        console.log('Body => ', body);

    }); */

    test('@Regression Test para obtener la informacion del 1 booking', async ( { request } ) => {
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


    test('@Regression Test para actualizar la informacion del 1 booking', async ( { request } ) => {
        const bookerId = 1;
        const updateInfoRequest = generateUpdateInfoRequest();

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

   

    test('@Regression - Test para la eliminación de un recurso', async ({ request } ) => {
        const bookerId = 1;

        const headersWithToken = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Cookie': `${token}`
        }

        const response = await request.delete('/booking/'+bookerId, {
            headers: headersWithToken
        });

        const statusCode = response.status();
        const body = await response.json();

        console.log('Status Code => ', statusCode);
        console.log('Body => ', body);

        expect(statusCode).toBe(201);
        expect(response.text).toEqual('Created');
    }); 
});
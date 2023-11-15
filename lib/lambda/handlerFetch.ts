
export const handler = async (event: any) => {
    console.log(event);
    
    switch(event.httpMethod){

        case "GET":
            let data = await getUser();
            console.log(data);
             
            return data
        
        default :
            return {
                statusCode: 404,
                body: "MOCKITO NO VALE"
            }
    }
}

const getUser = async () => {
    const resp = await fetch("https://6545ac18fe036a2fa954a9c1.mockapi.io/api/v1/users")
    const data =  await resp.json();

    // console.log(data);

    return {
        statusCode: 200,
        body: {
            "lambda":"MI LAMBDA ALGO...",
            data: JSON.stringify(data)
        }
    }
}
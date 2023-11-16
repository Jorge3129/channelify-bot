from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from db import conn

app = FastAPI()

@app.post('/add_channel')
async def add_channel(request: Request):
    channel_link = await request.json()
    with conn.cursor() as cur:
        cur.execute(f'''
            INSERT INTO channel (handle) 
            VALUES ('{channel_link["channel_link"]}') 
            ON CONFLICT DO NOTHING 
            RETURNING handle
        ''')

        result = cur.fetchall()
        conn.commit()

    if result:
        return JSONResponse(content=result[0])
    else:
        return JSONResponse(content={"message": f"{channel_link['channel_link']} already exists"}, status_code=status.HTTP_409_CONFLICT)


@app.get('/latest_shortened')
async def get_latest_shortened() -> JSONResponse:
    with conn.cursor() as cur:
        cur.execute('''
            SELECT DISTINCT ON (handle) handle, shortened, created_at
            FROM shortened
            ORDER BY handle, created_at DESC
        ''')

        result = cur.fetchall()

    response_content = []
    for row in result:
        response_content.append({
            'handle': row[0],
            'shortened': row[1],
            'created_at': row[2].strftime('%Y-%m-%d %H:%M:%S')
        })

    return JSONResponse(content=response_content)

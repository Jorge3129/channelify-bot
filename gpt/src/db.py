import os
import urllib.parse as urlparse
import psycopg2

url = urlparse.urlparse(os.environ.get('DATABASE_URL'))
dbname = url.path[1:]
user = url.username
password = url.password
host = url.hostname
port = url.port

# Database connection parameters
conn = psycopg2.connect(
    database=os.environ.get("PG_DATABASE") or dbname,
    user=os.environ.get("PG_USER") or user,
    password=os.environ.get("PG_PASSWORD") or password,
    host=os.environ.get("PG_HOST") or host,
    port=os.environ.get("PG_PORT") or port
)


# Create a cursor object
cur = conn.cursor()

# Create table
cur.execute(
    '''
    -- drop table channel;
    -- drop table shortened;

    create table if not exists channel (
        handle varchar(255) primary key
    );
    
    create table if not exists shortened (
        handle varchar(255) not null,
        created_at timestamp with time zone not null,
        shortened text not null,

        primary key (handle, created_at)
    );
    '''
)

# Commit the transaction
conn.commit()

# # Close the cursor and connection
# cur.close()
# conn.close()

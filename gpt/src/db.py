import os
import psycopg2

# Database connection parameters
conn = psycopg2.connect(
    database=os.environ.get("PG_DATABASE"),
    user=os.environ.get("PG_USER"),
    password=os.environ.get("PG_PASSWORD"),
    host=os.environ.get("PG_HOST"),
    port=os.environ.get("PG_PORT"),
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

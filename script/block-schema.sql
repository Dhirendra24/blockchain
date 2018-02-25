CREATE TABLE IF NOT EXISTS block (
    index           serial primary key,
    hash            varchar not null,
    previous_hash   varchar not null,
    payload         jsonb not null,
    timestamp       timestamp not null
);

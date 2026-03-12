## Run:

```bash
docker compose -f postgres-pgadmin4.yml up -d
```

## Connect via cli:

```bash
psql -h localhost -p 5432 -U <username> -d <database_name>
```

## Connect via Docker:

```bash
docker exec -it <container_name> psql -U <username> -d <database_name>
```

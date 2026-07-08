from app.config import Settings


class TestDatabaseUrlNormalization:
    def test_rewrites_postgres_scheme(self):
        s = Settings(database_url="postgres://u:p@host:5432/db")
        assert s.database_url == "postgresql+asyncpg://u:p@host:5432/db"

    def test_rewrites_postgresql_scheme(self):
        s = Settings(database_url="postgresql://u:p@host:5432/db")
        assert s.database_url == "postgresql+asyncpg://u:p@host:5432/db"

    def test_keeps_asyncpg_scheme(self):
        url = "postgresql+asyncpg://u:p@host:5432/db"
        assert Settings(database_url=url).database_url == url

    def test_keeps_sqlite_scheme(self):
        url = "sqlite+aiosqlite://"
        assert Settings(database_url=url).database_url == url

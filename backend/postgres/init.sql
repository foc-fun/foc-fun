-- TODO: Make unique on name:version
CREATE TABLE IF NOT EXISTS Classes (
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  hash char(64) NOT NULL,
  name text NOT NULL,
  version text NOT NULL
);
CREATE INDEX IF NOT EXISTS Classes_hash ON Classes (hash);
CREATE INDEX IF NOT EXISTS Classes_name ON Classes (name);
CREATE INDEX IF NOT EXISTS Classes_version ON Classes (version);

CREATE TABLE IF NOT EXISTS RegisteredClasses (
  hash char(64) NOT NULL
);
CREATE INDEX IF NOT EXISTS RegisteredClasses_hash ON RegisteredClasses (hash);

CREATE TABLE IF NOT EXISTS Contracts (
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  address char(64) NOT NULL,
  class_hash char(64) NOT NULL
);
CREATE INDEX IF NOT EXISTS Contracts_address ON Contracts (address);
CREATE INDEX IF NOT EXISTS Contracts_class_hash ON Contracts (class_hash);

CREATE TABLE IF NOT EXISTS RegisteredContracts (
  address char(64) NOT NULL
);
CREATE INDEX IF NOT EXISTS RegisteredContracts_address ON RegisteredContracts (address);

CREATE TABLE IF NOT EXISTS Events (
  id INTEGER PRIMARY KEY,
  contract_address char(64) NOT NULL,
  selector char(64) NOT NULL
);
CREATE INDEX IF NOT EXISTS Events_contract_address ON Events (contract_address);
CREATE INDEX IF NOT EXISTS Events_selector ON Events (selector);

CREATE TABLE IF NOT EXISTS RegisteredEvents (
  event_id INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS RegisteredEvents_event_id ON RegisteredEvents (event_id);

CREATE TABLE IF NOT EXISTS ProcessedEvents (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  event_id INTEGER NOT NULL,
  keys text[] NOT NULL,
  data text[] NOT NULL
);
CREATE INDEX IF NOT EXISTS ProcessedEvents_event_id ON ProcessedEvents (event_id);
CREATE INDEX IF NOT EXISTS ProcessedEvents_keys ON ProcessedEvents USING GIN (keys);

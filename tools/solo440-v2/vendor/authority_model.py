"""Offline qualification model. No provider, admission, or activation adapter."""
import hashlib
import json
import re
import sqlite3
from dataclasses import asdict, dataclass

SCHEMA = "calcumint.singleton440.owner-authority.v1"
AMENDMENT = "62c30cc17ad5b9a87e57bb2e91a5ee2b25bbcfd3d9fe3c3e7f1775a99cd8475a"
CANDIDATE = "1637b2a2bf582ebc6e4f4452ff9f3a3fe082b35e"
TREE = "209982b9a81d7bf9f4783228505b5a274563391f"
NOMINATION = "aef727afa4234c4e0e7c6db84bfa312e85696ac655513d3cd6b10a2d829af449"
ARCHIVE = "6fcfdf70a0e08004e4c7df76a1417b905b166a97cb7f5bba7b2adcf592ca4a72"
SHA = re.compile(r"[0-9a-f]{64}")


@dataclass(frozen=True)
class FixtureGrant:
    run: str
    attempt: int
    nonce: str
    issued: int
    expires: int
    evidence: str
    executor: str
    policy: str
    schema: str = SCHEMA
    amendment: str = AMENDMENT
    candidate: str = CANDIDATE
    tree: str = TREE
    nomination: str = NOMINATION
    archive: str = ARCHIVE
    action: str = "source-only-fixture"
    activate: bool = False


@dataclass(frozen=True)
class FixtureContext:
    run: str
    evidence: str
    executor: str
    policy: str
    owner_authenticated: bool = False
    applicability_confirmed: bool = False
    adopted: bool = False
    exact_source_verified: bool = False
    owner_methodology_accepted: bool = False


def initialize_fixture(database):
    with sqlite3.connect(database) as connection:
        connection.execute("""
            CREATE TABLE claims (
                run TEXT PRIMARY KEY,
                nonce TEXT NOT NULL UNIQUE,
                grant_digest TEXT NOT NULL UNIQUE
            )
        """)


def claim_fixture(database, grant, context, now):
    """Only a synthetic outcome is returned, after the claim commits."""
    expected = FixtureGrant(
        context.run, 1, grant.nonce, grant.issued, grant.expires,
        context.evidence, context.executor, context.policy,
    )
    gates = (
        context.owner_authenticated, context.applicability_confirmed,
        context.adopted, context.exact_source_verified,
        context.owner_methodology_accepted,
    )
    if not all(gate is True for gate in gates):
        return None
    if any(type(value) is not type(getattr(expected, key))
           for key, value in asdict(grant).items()) or grant != expected:
        return None
    if not re.fullmatch(r"[0-9a-f]{32}", grant.nonce):
        return None
    if not re.fullmatch(r"[1-9][0-9]*", grant.run):
        return None
    if not all(SHA.fullmatch(value) for value in (grant.evidence, grant.executor, grant.policy)):
        return None
    if type(now) is not int or not grant.issued <= now < grant.expires <= grant.issued + 600:
        return None
    digest = hashlib.sha256(
        json.dumps(asdict(grant), sort_keys=True, separators=(",", ":")).encode()
    ).hexdigest()
    try:
        with sqlite3.connect(f"file:{database.resolve().as_posix()}?mode=rw", uri=True) as connection:
            connection.execute("INSERT INTO claims VALUES (?, ?, ?)", (grant.run, grant.nonce, digest))
    except sqlite3.Error:
        return None
    return {"simulation": True, "admitted": False, "activated": False, "grant_sha256": digest}

# The evidence log

Every deal has an append only log. Each message, version, signature, invoice, payment, delivery, open, download, approval and change is written to it as it happens, with the server's time and, where it matters, the internet address and browser of whoever did it.

## Why nobody can quietly edit it

Each entry carries a SHA-256 fingerprint of itself and of the entry before it, so the entries form a chain. Editing, backdating or deleting any entry breaks the chain at that exact entry. Files are fingerprinted too.

Corrections are never made by changing an entry. They are new entries.

## Check it yourself

Open a deal's **Evidence log** and choose **Check this log**. PactPal walks down the chain and either confirms every entry matches its fingerprint or shows the first entry that no longer does. The same check is described in every evidence packet, so anyone can repeat it.

## The records score

Each deal has a score from 0 to 100 that measures how complete its records are: a confirmed agreement, what is not included, the buyer's signature and receipt, payment through PayPal, deliveries opened, approvals and steps recorded as they happened. It lists what is helping and what is missing, with how to fix it.

The score measures records only. It never predicts the outcome of a dispute.

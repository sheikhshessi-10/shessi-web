const e="tennessee-cpo",t="Tennessee CPO: what happens to a bid, stage by stage",s="Portal pedia · 46",n="Tennessee CPO: what happens to a bid, from two web pages to the board",a="Every stage of the run of 28 July 2026, with a real record from the actual files at each step. The headline of this night: the AI judge never ran. Two brand-new bids arrived, both were thrown out at triage, and the single YES you see at the end of the funnel is a copy of a decision made on 23 June that the compile step has re-stamped on every run since.",o=[{value:"28",label:"in snapshot"},{value:"26",label:"carryover"},{value:"2",label:"new tonight"},{value:"1",label:"triage says open"},{value:"27",label:"triage says skip"},{value:"1",label:"yes"}],i="Every number above is from data/tennessee-cpo/daily/2026-07-28/stats.json (438 bytes). Read the last two cells carefully. The 1 OPEN is not one of tonight's two new bids. It is a carryover bid opened on 23 June. And the 1 YES was not scored tonight: runs/judge-verdicts.json is 2 bytes long and holds []. Snapshot sizes: data/tennessee-cpo/bids/all-bids.json is 51,998 bytes and 28 rows.",r=["Bid A · 35910-14666 · Bright Futures, an RFQ. SKIP. Decided 26 June, riding as carryover.","Bid B · 32110-82026 · SWC 820 Debris Removal Services. YES, score 88. Decided 23 June, carried forward ever since.","Tonight's only genuinely new bids: 32801-13961 (janitorial) and 34320-20827 (consulting). Both SKIP."],l=[{n:"0",title:"Is this portal due tonight?",who:"python scripts/portal_due.py --batch portals",summary:["Tennessee CPO does not run every night. It runs every third day. The gate looks at the newest dated folder inside data/tennessee-cpo/daily/ and compares it to today. The last folder was 2026-07-23, five days old, so the portal was due and got dispatched.","The live cadence number is read from the board database first and falls back to the registry file if that read fails."],cells:[{label:"In → Out",paths:[{path:"data/portals/registry.json",size:"this portal's row"},{path:"data/tennessee-cpo/daily/",size:"33 dated folders on record"},{path:"a printed list of due slugs",size:"no file is written"}],blocks:[],notes:[],tables:[]},{label:"The real registry row",paths:[],blocks:[`{
 "slug": "tennessee-cpo",
 "label": "Tennessee CPO",
 "engine": "tennessee_cpo",
 "batch": "portals",
 "cadence_days": 3,
 "authed": false,
 "enrich_passes": [],
 "watch": "none",
 "in_cumulative": true,
 "in_portalpro": true,
 "carry_forward": "engine-internal"
}`],notes:["Three of these fields decide what the shared machinery does with this portal later. Watch stage 9."],tables:[]}],notes:[],then:"one child agent takes the whole sweep"},{n:"1",title:"Dispatch",who:"Agent reading ../.claude/skills/tennessee-cpo-sweep/SKILL.md",summary:["Tennessee CPO is the fourth slot in Batch C of the nightly portal run. One child agent picks up the skill file and runs the sweep end to end.","It is not on the heavy-pull list. The whole pull is two page loads, not a long crawl, so it can share the machine with everything else running at the same time."],cells:[{label:"In",paths:[{path:"../.claude/skills/tennessee-cpo-sweep/SKILL.md",size:"the phase list"}],blocks:[],notes:[],tables:[]},{label:"Out",paths:[{path:"a running child agent",size:"no file"}],blocks:[],notes:["If the child fails, the roll-up marks this portal FAILED and the other portals keep going."],tables:[]}],notes:[],then:"a real browser opens two plain web pages"},{n:"2",title:"Pull",who:"data/tennessee-cpo/scripts/run_daily.py (step 1: ps.pull)",summary:["Tennessee posts everything on two ordinary HTML pages: Invitations to Bid, and RFP/RFQ/RFI Opportunities. We still have to drive a real headless Chromium to read them, because www.tn.gov rejects plain Python at the security handshake before a single byte of the page comes back. Nothing here is logged in. It is public content fetched the long way round.","Both tables are parsed, merged, and filtered down to the bids whose closing date has not passed. 105 rows were parsed, 77 were already closed, 28 survived.","Documents are grabbed right here, at pull time. Every link in the first table cell (the notice, the amendments, the attachments, the evaluation spreadsheet) becomes a document entry. All 28 bids in this snapshot carry documents, 84 files in total. That matters a lot at stage 12."],cells:[{label:"In → Out",paths:[{path:"two tn.gov list pages",size:"ITB + RFP/RFQ/RFI"},{path:"bids/all-bids.json",size:"51,998 bytes · 28 rows"},{path:"bids/index.json",size:"550 bytes"},{path:"recon/itb.html",size:"96,188 bytes"},{path:"recon/rfp.html",size:"151,995 bytes"},{path:"logs/pull_log.txt",size:"27,009 bytes"}],blocks:[`20:22:12 TN CPO pull starting · today=2026-07-28
 (Playwright, anonymous)
20:22:19 fetch itb attempt 1 error: Page.goto:
 net::ERR_CONNECTION_RESET
20:22:22 fetched itb: HTTP 200, 94798 bytes (attempt 2)
20:22:24 fetched rfp: HTTP 200, 150222 bytes (attempt 1)
20:22:26 parsed rows: itb=29 rfp=76 total=105
20:22:26 deduped=105 · OPEN(due>=2026-07-28)=28
 · dropped_closed=77
20:22:26 wrote 28 open bids`],notes:["The site dropped the first connection. The retry caught it three seconds later. This is the documented failure mode firing on the anchor night itself."],tables:[]},{label:"Real record Bid A",paths:[],blocks:[`{
 "bid_id": "35910-14666",
 "title": "Bright Futures - UPDATED",
 "buyer": "",
 "agency": "",
 "agency_code": "",
 "solicitation_type": "RFQ",
 "status": "Open",
 "due_date": "2026-07-29",
 "due_date_raw": "07/29/2026",
 "posting_date": "2026-06-25",
 "state": "TN",
 "detail_url": "https://www.tn.gov/content/dam/tn/
 generalservices/documents/cpo/rfq/35910-14666/
 RFQ%2035910-14666%20Bright%20Futures%20-%20DCS.pdf",
 "documents": [
 {"name": "RFQ 35910-14666", "url": "…", "type": "pdf"},
 {"name": "Solicitation Notice", "url": "…", "type": "pdf"},
 {"name": "Amendment 1", "url": "…", "type": "pdf"}
 ],
 "description": "",
 "contact_name": "",
 "contact_phone": "",
 "contact_email": "",
 "_detail_ok": false
}`],notes:["Note what is blank: buyer, agency, description, contact. That is the normal shape here, not a failure. There is no detail page on this portal. The detail_url is the PDF itself."],tables:[]}],notes:['Buyer is blank on 27 of the 28 bids. The list pages have no agency column at all. A buyer is filled in only when one of 13 known Tennessee agency codes appears as a whole word inside the title. Tonight exactly one bid qualified: 32801-13961, whose title starts "TWRA", so it got "TN Wildlife Resources Agency". Nothing is ever guessed. This blank is the root of two problems further down the page.',"A refusal that protects the snapshot. If a fetch comes back partial and would make the snapshot smaller, the pull refuses to write it and keeps yesterday's file. And when it does write, any field that is empty today but was filled yesterday is merged forward. That merge is why an enriched record can sit in this file on a night when nothing was enriched. See stage 5."],then:"which of these 28 have we never seen before?"},{n:"3",title:"Prep: split old from new",who:"data/tennessee-cpo/scripts/run_daily.py (step 2: ps.prep)",summary:["Tonight's 28 bids are checked against the 28 ids in the last archive folder, daily/2026-07-23/triage.json. Anything already decided becomes carryover and keeps its old answer for free. Only the never-seen ones cost an AI call. 26 were carryover. 2 were new.","Prep also blanks three working files to [] before it starts: triage-verdicts.json, judge-verdicts.json and judge-input-open.json. That is deliberate. It means a row in any of those files can only have come from tonight's run, never from a stale leftover. The code comment names what went wrong before the blanking existed: one portal was injecting two phantom rows, and on another a leftover file of 40 still-live bids would have had a prior day's verdicts re-stamped as today's."],cells:[{label:"In → Out",paths:[{path:"bids/all-bids.json",size:"28 rows"},{path:"daily/2026-07-23/triage.json",size:"last run's memory"},{path:"runs/triage-input.json",size:"390 bytes · 2 rows"},{path:"runs/triage-carryover.json",size:"3,432 bytes · 26 rows"},{path:"runs/judge-input.json",size:"19,363 bytes · 28 rows"},{path:"runs/_funnel.json",size:"152 bytes"}],blocks:[`{
 "date": "2026-07-28",
 "snapshot_total": 28,
 "carryover_count": 26,
 "triage_input_count": 2,
 "prior_archive_ids_compared_against": 28
}`],notes:[],tables:[]},{label:"triage-input.json, the whole file, both new bids",paths:[],blocks:[`[
 {
 "idx": 8,
 "bid_id": "32801-13961",
 "title": "TWRA Region 4 Janitorial Services",
 "buyer": "TN Wildlife Resources Agency",
 "state": "TN",
 "due_date": "2026-08-11"
 },
 {
 "idx": 26,
 "bid_id": "34320-20827",
 "title": "Healthcare Management Consulting Services",
 "buyer": "",
 "state": "TN",
 "due_date": "2026-09-03"
 }
]`,`{
 "bid_id": "35910-14666",
 "decision": "SKIP",
 "reason": "no LGS verb, social/education program"
}`,`{
 "bid_id": "32110-82026",
 "decision": "OPEN",
 "reason": "Cat 1 disaster debris removal"
}`],notes:["Neither of these answers was written tonight. Bid A's was written on 26 June, Bid B's on 23 June. They cost nothing to re-use."],tables:[]}],notes:["Two files, easy to confuse. judge-input.json is the full 28-row pool the whole snapshot renders into. judge-input-open.json, built at stage 6, is the small filtered slice the AI judge actually reads. Only the second one is a prompt."],then:"two titles go to the AI"},{n:"4",title:"Triage: open it, or drop it",who:"Agent max-triage · Pass 1",summary:["The first AI pass gets four fields per bid: title, buyer, state, closing date. No description exists yet on this portal, so this is very nearly a title-only judgement. The default answer is SKIP.","Both of tonight's new bids were dropped. Janitorial work and management consulting are not what LGS does."],cells:[{label:"In → Out",paths:[{path:"runs/triage-input.json",size:"390 bytes · 2 rows"},{path:"runs/triage-verdicts.json",size:"261 bytes · 2 rows"}],blocks:[],notes:["This is the portal's weakest link. A SKIP here is final. The bid's PDF is never opened, so a thin construction title with no obvious LGS verb in it dies without anyone ever reading its scope. On 27 of the 28 bids the AI also had no buyer to lean on."],tables:[]},{label:"triage-verdicts.json, the whole file",paths:[],blocks:[`[
 {
 "idx": 8,
 "bid_id": "32801-13961",
 "decision": "SKIP",
 "reason": "janitorial, wrong vertical"
 },
 {
 "idx": 26,
 "bid_id": "34320-20827",
 "decision": "SKIP",
 "reason": "consulting, professional services"
 }
]`],notes:["Zero OPENs from tonight's new bids. That single fact is what empties the next three stages."],tables:[]}],notes:[],then:"nothing was opened, so there is no PDF to fetch"},{n:"5",title:"Enrich the OPENs: read the solicitation PDF",who:"ps.enrich_opens(PORTAL, config, open_ids) · DID NOT RUN ON THIS NIGHT",summary:["This is the only stage that can give a Tennessee bid a description and a named contact. For each bid triage opened, it downloads the main solicitation PDF (that file host is happy with plain requests, unlike the list pages), pulls out the purpose and scope block, and lifts the coordinator's details out of the communications section.","On 28 July it did nothing, because there was nothing for it to do. Triage returned zero OPENs, so zero PDFs were fetched. The pull log has no enrich_details line for that date at all."],cells:[{label:"Every enrich this portal has ever logged",paths:[],blocks:[`2026-06-23T18:10:19 fetching 1 OPEN solicitation PDFs
2026-06-23T18:10:33 1/1 enriched with scope/contact
2026-06-25T17:20:25 fetching 1 OPEN solicitation PDFs
2026-06-25T17:20:27 1/1 enriched with scope/contact
2026-07-22T17:52:03 fetching 1 OPEN solicitation PDFs
2026-07-22T17:52:13 1/1 enriched with scope/contact`],notes:[`1 of 28 rows is enriched. Exactly one bid in tonight's snapshot has a description, a page text and a contact: Bid B. The other 27 were SKIPped, so their PDFs were never opened. Anyone reading "description coverage 100%" in the runbook is reading a number computed over enriched rows, not over the snapshot.`,"Three enrichments in the portal's whole recorded history, all of them for the same one bid. The last was 22 July. Nothing on 28 July."],tables:[]},{label:"Real record Bid B · written 22 July, merged forward tonight",paths:[],blocks:[`{
 "bid_id": "32110-82026",
 "title": "SWC 820 – Debris Removal Services - UPDATED",
 "buyer": "",
 "agency": "",
 "solicitation_type": "RFP",
 "status": "Open",
 "due_date": "2026-07-29",
 "posting_date": "2026-06-22",
 "state": "TN",
 "description": "Scope of Services and Deliverables
 (Section A); ▪ Contract Period (Section B); ▪ Payment
 Terms (Section C); ▪ Standard Terms and Conditions
 (Section D); and, ▪ Special Terms and Conditions
 (Section E). The pro forma contract substantially
 represents the contract document that the successful
 Respondent must sign. 1.3. Nondiscrimination…",
 "contact_name": "Seth Lake",
 "contact_phone": "615-507-6930",
 "contact_email": "Seth.Lake@tn.gov",
 "_detail_ok": true,
 "page_text": "12-18-25 RFP\\nSTATE OF TENNESSEE \\n
 DEPARTMENT OF GENERAL SERVICES, CENTRAL PROCUREMENT
 OFFICE \\nREQUEST FOR PROPOSALS \\nFOR \\nSWC 820 –
 Debris Removal Services \\nRFP # 32110-82026…"
}`],notes:['Two honest oddities in this record. The description starts mid-sentence, because the scope grab begins at a section header inside the PDF. And the contact name is built from the email address (Seth.Lake@tn.gov becomes "Seth Lake"), not read off the page.'],tables:[]}],notes:[],then:"who still needs a score?"},{n:"6",title:"Build the judge's list, and it comes out empty",who:"ps.build_judge_input_open(PORTAL)",summary:["This stage decides who the second AI pass will see. It adds together three groups: bids opened tonight, bids opened on an earlier night that were never scored, and bids already scored whose underlying material has changed since last time.","On 28 July all three groups were empty. No new OPENs. The one carryover OPEN, Bid B, already has a verdict on file. And its material had not changed. So the file it writes is two bytes long."],cells:[{label:"In → Out",paths:[{path:"runs/triage-verdicts.json",size:"2 rows, both SKIP"},{path:"runs/triage-carryover.json",size:"26 rows, 1 of them OPEN"},{path:"daily/2026-07-23/verdicts.json",size:"the prior verdict for that OPEN"},{path:"runs/judge-input.json",size:"the 28-row pool to filter"},{path:"runs/judge-input-open.json",size:"2 bytes · 0 rows"}],blocks:[],notes:[],tables:[]},{label:"judge-input-open.json, the whole file",paths:[],blocks:["[]"],notes:[`Empty is correct here, not broken. This is the money-saving rule working: a bid that already has a verdict and has not changed does not get scored again. Its old verdict is carried forward at stage 8 instead. The cost is that the funnel's "1 yes" looks like a fresh result when it is a memory.`],tables:[]}],notes:[],then:"the judge has nothing to read"},{n:"7",title:"Judge: yes, maybe or no",who:"Agent max-bid-judge · Pass 2 · DID NOT RUN ON THIS NIGHT",summary:["The second AI pass reads the PDF scope and returns a verdict, a score out of 100, a category and the reasoning. On this portal it is also told to flag every yes and maybe as out of core state.","On 28 July its input file was empty, so it produced nothing. Its output file was blanked at stage 3 and still holds [] at the end of the run."],cells:[{label:"In → Out",paths:[{path:"runs/judge-input-open.json",size:"2 bytes · 0 rows"},{path:"runs/judge-verdicts.json",size:"2 bytes · 0 rows"}],blocks:[],notes:[`Because prep blanks this file before every run, a row in it always means "tonight's run wrote this". Two bytes means the judge did not speak.`],tables:[]},{label:"How often this portal has ever produced a verdict",paths:[],blocks:[`33 daily archive folders on record
14 of them hold an empty verdicts.json
19 of them hold 32110-82026 at score 88

first appearance 2026-06-23 1 row
second bid added 2026-06-25 2 rows
every day since no new bid has entered the file`],notes:["Only two days in this portal's life ever added a bid to its verdicts file. 23 June and 25 June. The second one, 32110-13943, was scored no at 8 and dropped out of the archive after 7 July when it closed. Everything you see on the board today traces back to those two nights."],tables:[]}],notes:[],then:"the night gets written down anyway"},{n:"8",title:"Compile: write tonight's folder",who:"ps.compile_archive(PORTAL, config)",summary:["Carryover answers and tonight's two new answers are merged into one triage file of 28 rows. Then the important bit: yesterday's verdicts are merged with tonight's. Tonight had none, so yesterday's single row is copied straight through, score and reasoning unchanged.","This is where the 88 comes from. Not from an AI call on 28 July. From daily/2026-07-23/verdicts.json, which got it from 20 July, which got it from 16 July, and so on back to 23 June."],cells:[{label:"Out · data/tennessee-cpo/daily/2026-07-28/",paths:[],blocks:[`{
 "bid_id": "35910-14666",
 "decision": "SKIP",
 "reason": "no LGS verb, social/education program"
}`],notes:["Bid A's whole journey: pulled, matched to a decision made on 26 June, written down again. It cost nothing tonight."],tables:[[{header:!0,cells:["File","Holds","Size"]},{header:!1,cells:["new-bids.json","28 rows, the whole snapshot","51,998 bytes"]},{header:!1,cells:["triage.json","28 decisions, tomorrow's memory","3,690 bytes"]},{header:!1,cells:["verdicts.json","1 row, carried from 23 June","642 bytes"]},{header:!1,cells:["stats.json","the funnel counts","438 bytes"]},{header:!1,cells:["report.md","human summary","962 bytes"]}]]},{label:"Real record Bid B in verdicts.json, the whole file",paths:[],blocks:[`{
 "bid_id": "32110-82026",
 "title": "SWC 820 – Debris Removal Services",
 "buyer": "Tennessee Central Procurement Office",
 "state": "TN",
 "would_lgs_bid": "yes",
 "score": 88,
 "category": "Category 1 — Disaster / Storm Debris
 Removal",
 "primary_reason": "Statewide pre-positioned emergency
 debris removal contract from a state CPO — textbook
 LGS core work; statewide scope, standing contract
 structure, and emergency/disaster debris removal
 language match the exact pattern LGS wins on
 repeatedly.",
 "red_flags": ["out_of_core_state"],
 "verdict": "yes"
}`],notes:[`Look at the buyer. The snapshot record for this same bid has "buyer": "". "Tennessee Central Procurement Office" is the AI's own words, written into the verdict row and never checked against anything. It is a reasonable guess. It is still a guess, and it is the value the board shows.`],tables:[]}],notes:[`A small field trap. stats.json reports "endpoint": "https://www.tn.gov", which is just the site's front door. The two real list pages this portal actually reads are recorded somewhere else, in bids/index.json under endpoints. Quoting stats.json as "the source" tells you nothing useful.`],then:"the portal's own work is done, the shared machinery takes over"},{n:"9",title:"Carry-forward: this portal is deliberately left out",who:"2.5 · python scripts/carry_forward_verdicts.py --all",summary:[`There is a shared safety net that rescues verdicts for bids that dropped out of a night's pull. It does not touch Tennessee CPO. The --all switch only picks up portals whose registry entry says carry_forward: "orchestrator". This one says "engine-internal", so it is filtered out of the list before anything runs.`,"That is not neglect. It is because the portal's own sweep already carries verdicts forward, in two halves, and running the shared net on top would apply the same rescue twice."],cells:[{label:"The two halves that do the job instead",paths:[],blocks:[],notes:[`The registry value is a safety gate, not a label. It is checked for drift. If someone flipped this slug to "orchestrator" without removing the engine's own two halves, the same verdict would be carried twice.`],tables:[[{header:!0,cells:["Where","What it carries","Seen tonight as"]},{header:!1,cells:["Stage 3, prep","every prior triage decision for a bid still in the snapshot","triage-carryover.json, 26 rows"]},{header:!1,cells:["Stage 8, compile","every prior verdict for a bid still live","verdicts.json, 1 row at score 88"]}]]}],notes:[],then:"the ledger, the report and the hand-off file"},{n:"10",title:"Ledger, report, and the hop out of the portal folder",who:"2.6 portals_cumulative.py · 2.7 standardize_daily_reports.py · 2.8 dump_yes_for_portalpro.py",summary:["Three shared steps in a row. The first walks every archive this portal ever wrote and folds its YES bids into the all-portal ledger. The second throws away the report the sweep wrote and rebuilds it in the one shared layout. The third normalises the YES bids into the fixture file that the board publisher reads next. This is the point where a Tennessee bid stops being a Tennessee file and becomes a board card.",'Only "yes" makes this hop. A Tennessee "maybe" is archived on disk and goes no further, because maybes are forwarded for federal portals only and this is not one. Tonight there were no maybes, so nothing was lost.'],cells:[{label:"In → Out",paths:[{path:"daily/*/verdicts.json",size:"all 33 archive days"},{path:"data/portals/cumulative-yes.json + .md",size:null},{path:"daily/2026-07-28/report.md",size:"962 bytes, rewritten"},{path:"../PortalPro/src/fixtures/portal-bids.json",size:null}],blocks:[],notes:["Which fields survive the hop. The buyer is taken from the judge's row before the snapshot, so the AI's guessed buyer wins. The contact name, email and phone are taken only from the snapshot, so the details lifted out of the PDF do survive. That contact is the one genuinely useful field this portal hands an operator."],tables:[]},{label:"report.md, rebuilt: the real file",paths:[],blocks:[`# Tennessee Central Procurement Office (CPO) —
 Statewide ITB + RFP/RFQ/RFI — 2026-07-28

**Source:** https://www.tn.gov · engine \`tennessee_cpo\`
· state TN

- Snapshot: **28** open bids
- Carryover: 26 · NEW today: 2
- Triage: 1 OPEN / 27 SKIP
- Scored: **1 YES / 0 MAYBE / 0 NO**

## YES — Max would bid

- **[88] SWC 820 – Debris Removal Services** —
 Tennessee Central Procurement Office · closes 2026-07-29
 Statewide pre-positioned emergency debris removal
 contract from a state CPO — textbook LGS core work…
 _flags: out_of_core_state_

## MAYBE — operator judgment

_none_`],notes:['"Scored: 1 YES" is the same honest-but-misleading line as the funnel. Nothing was scored on 28 July.'],tables:[]}],notes:[],then:"bids stop being portal-shaped here"},{n:"11",title:"Publish, cluster, dedupe",who:"2.85 · publish_to_supabase.py → llm_dedup_candidates.py → bid-dedup-judge → apply_llm_dedup.py",summary:["The fixture is pushed into the board database next to every other portal's bids, and then bids are grouped into clusters so that one solicitation showing up on three portals appears once for the operator.","Clusters are split by distinct buyer. This portal is the worst case for that rule, because 27 of its 28 snapshot rows carry no buyer at all, and the one bid that does reach the board carries the judge's guessed buyer rather than anything Tennessee wrote. The deterministic key is resting on a guess, and the rest of the merge decision falls to the AI dedup judge.",`You would expect the solicitation number to save it. It does not. The bid id 32110-82026 is the state's own solicitation number, but the board row carries "solicitation_no": null, and tennessee-cpo is not on the trusted-solicitation-number allowlist in scripts/normalize.py (that list is beaconbid, ms-dfa, nc-evp, sam-gov, scbo, texas-esbd, va-eva). So this portal's number can neither drive a merge nor block one.`],cells:[{label:"In → Out",paths:[{path:"../PortalPro/src/fixtures/portal-bids.json",size:null},{path:"daily/2026-07-28/stats.json",size:"only for the run-stats row"},{path:"board tables: portals, bids, clusters, sweep_runs",size:null}],blocks:[],notes:['The buyer on the board is not from Tennessee. all-bids.json says "". The card says "Tennessee Central Procurement Office". That string was written by the judge at Pass 2 and then treated as fact by everything downstream, including the clustering key.'],tables:[]},{label:"Real card Bid B on the board",paths:[],blocks:[`{
 "id": "a66dbc9f085e73f1",
 "portal": "tennessee-cpo",
 "portal_label": "Tennessee CPO",
 "source_bid_id": "32110-82026",
 "title": "SWC 820 – Debris Removal Services",
 "buyer": "Tennessee Central Procurement Office",
 "state": "TN",
 "solicitation_no": null,
 "federal": false,
 "score": 88,
 "verdict": "yes",
 "category": "Category 1 — Disaster / Storm Debris
 Removal",
 "due_date": "2026-07-29",
 "contact_name": "Seth Lake",
 "contact_email": "Seth.Lake@tn.gov",
 "contact_phone": "615-507-6930",
 "red_flags": ["out_of_core_state"],
 "fit_signals": [],
 "first_seen": "2026-06-23",
 "last_seen": "2026-07-28",
 "has_documents": true
}`],notes:["Two things to notice. solicitation_no is null even though the bid id is the solicitation number. And has_documents says true — which is correct, but it is a fact about the cluster, not about Tennessee. Stage 12 says who actually put those files there."],tables:[]}],notes:[],then:"the board tries to read the documents"},{n:"12",title:"Documents: Tennessee's own files never publish, and another portal covers for it",who:"2.85b run_enrichment_phase.py → publish_bid_documents.py · 2.87 extract_doc_text.py → requirements-extractor",summary:["Every portal's snapshot is scanned for attached documents, which are uploaded and then read so an agent can list what each bid requires. Tennessee CPO carries documents on all 28 bids, 84 files in total, captured for free at pull time.","On 28 July, not one of them was uploaded by this portal. The Tennessee engine writes each document as name / url / type. The publisher wanted file_name plus file_url or file_path, and quietly skipped any row that lacked them. No error, no log line, every night.","Be precise about how many files that costs. The publisher only ever looks at a bid that already has a cluster on the board, and only 1 of the 28 has one — Bid B. So five files reached the field check and were skipped there; the other 79 belong to bids that never reached the board, so they have no cluster to attach to and were never candidates.","On the raw survey number this portal is still the biggest single source of the mismatch: a count across every portal's snapshot finds 92 documents in the minority spelling — 84 from Tennessee CPO, 6 from ms-mdot-letting, 2 from sc-sceis. That 84 is this same snapshot file counted by someone else, not a second independent measurement.",`And yet the operator does see documents on this bid. Bid B's cluster is shared with two other portals — bidnet and napc list the same solicitation — and the BidNet path uploaded four files to that cluster on 12 July. Three of them are the same files Tennessee lists; Tennessee's Amendment 1 is not among them. Requirements for the cluster were then extracted from those four documents: bid_requirements holds status "ok", model "requirements-extractor v1", and four source_doc_ids that are exactly those rows, written on 21 July. Not from page text — the Tennessee page text was not captured until 22 July, a day later.`],cells:[{label:"What the engine writes",paths:[],blocks:[`"documents": [
 {"name": "RFP 32110-82026",
 "url": "https://www.tn.gov/content/dam/tn/general
 services/documents/cpo/rfp-updates/32110-82026/
 RFP_32110-82026_Emergency_Debris_Removal_Services.pdf",
 "type": "pdf"},
 {"name": "Solicitation Notice", "url": "…", "type": "pdf"},
 {"name": "Amendment 1", "url": "…", "type": "pdf"},
 {"name": "Attachment 1", "url": "…Appendix_A_Scope_of_
 Services.pdf", "type": "pdf"},
 {"name": "Evaluation Model", "url": "…Attachment_6.3.xlsx",
 "type": "xlsx"}
]`],notes:["Five real files for Bid B, including the scope appendix and the scoring spreadsheet. All five are skipped at the upload check. Bid B is the only one of the 28 that even gets this far."],tables:[]},{label:"The same gap, seen from five places",paths:[],blocks:[],notes:["Nothing retried it either. This portal has no enrichment passes configured and is not on the zero-document backstop list, so there was no second attempt. Fourteen engines write file_name / file_url; Tennessee CPO, ms-mdot-letting and sc-sceis write name / url.",`The fix exists on disk today, and it is not switched on. A translator, scripts/document_link.py, was written on 3 August, and publish_bid_documents.py now reads every document through it, so both spellings are accepted. That change is entry B1 in docs/PROPOSED-CHANGES.md, which calls it "the only entry in this document that alters a real nightly run" and marks it not reviewed, not approved, not committed. Deploy from a git commit and the documents still vanish. Copy the folder and five files publish on the first run, not 84 — B1's own headline number counts every document in the minority spelling, but the publisher only touches a bid that has a cluster, and Bid B is the only Tennessee bid that does. That decision has not been made yet.`],tables:[[{header:!1,cells:["The snapshot on disk","28 of 28 bids carry documents · 84 files"]},{header:!1,cells:["The runbook",'"document coverage 100%", measured over the snapshot']},{header:!1,cells:["The board card for Bid B",`"has_documents": true — set from the cluster's bid_documents rows, not from the snapshot`]},{header:!1,cells:["The board's documents table",`4 rows on Bid B's cluster, every one of them uploaded_by "bidnet-auto". Nothing this portal's own publish path put there`]},{header:!1,cells:["The other 27 bids","never published, so no cluster, so their 79 files have nowhere to attach"]},{header:!1,cells:["The goal-state matrix","will read 0% documents for this portal, because it counts by portal, not by cluster"]}]]}],notes:[],then:"anything now comparable that was not before?"},{n:"13",title:"Dedup, second pass",who:"2.875 · llm_dedup_candidates.py → bid-dedup-judge → apply_llm_dedup.py",summary:["Dedup runs again, but only on pairs whose evidence actually changed after enrichment filled in buyers, closing dates and solicitation numbers. Everything already decided stays decided.","This is the pass that matters most for Tennessee. A bid that published with a blank buyer only becomes safely comparable once something else supplies an agency name for it. Until then the merge rests entirely on the AI's judgement of two titles."],cells:[{label:"In → Out",paths:[{path:"board tables: clusters + dedup_adjudications",size:null},{path:"data/portals/llm-dedup-merges.json",size:null}],blocks:[],notes:[],tables:[]}],notes:[],then:"what changed, who needs telling, did the run hold together"},{n:"14",title:"Watch, mail, sentinel",who:"2.88 · watch_list_signals.py · publish_page_text.py · the digest senders · pipeline_sentinel.py",summary:["Tonight's snapshot is compared with the last archived one to spot list-level changes, the captured PDF text is pushed into the board's page-text table, the operator digests go out, and a health check closes the run.",`The registry says watch: "none". That means no second visit to re-capture a page. It does not mean unwatched. The free list-signal watcher runs over every portal in the registry, and on this portal the natural signal is a new amendment link appearing in a bid's document list.`],cells:[{label:null,paths:[],blocks:[],notes:[],tables:[[{header:!0,cells:["Step","State for this portal"]},{header:!1,cells:["List-signal diff against the prior archive","runs; a new Amendment link is the natural change signal here"]},{header:!1,cells:["Push captured page text to the board","live, but for 1 bid only. Bid B is the only row with page text"]},{header:!1,cells:["Watch v2 page re-capture","off by registry setting"]},{header:!1,cells:["New-bid, watch and deadline digest emails","silent until an email key is put in data/auth/resend.env"]},{header:!1,cells:["Bid packs rebuilt","Bid B's pack on disk holds 4 document files plus page-tennessee-cpo.md, page-bidnet.md and page-napc.md — the documents came from the BidNet side of the cluster. A pack built from Tennessee alone would have an empty docs folder and only the page file"]},{header:!1,cells:["Sentinel health check","runs; writes data/portals/sentinel.json"]}]]}],notes:[],then:null}],d=[{heading:"The quirks that bite",tables:[[{header:!0,cells:["Quirk","Consequence"]},{header:!1,cells:["Documents are written as name/url/type; the publisher wanted file_name + file_url",`Bid B's five files were skipped at that check without a word. The other 79 never even reached it — their bids never reached the board, so there is no cluster to attach them to. Of the 92 documents in the minority spelling system-wide, 84 are this portal's. The runbook reads "document coverage 100%", the goal-state matrix reads 0%, and both measure honestly, just different things.`]},{header:!1,cells:['The board card says "has_documents": true',"And it is right, for a reason that has nothing to do with Tennessee. The flag is read from the cluster's bid_documents rows (dump_yes_for_portalpro.py), and that cluster holds 4 files the BidNet path uploaded on 12 July. An operator clicking through sees four files, not the five Tennessee listed — Amendment 1 is missing. If BidNet ever stops carrying this solicitation, the card keeps its paperclip only as long as those rows survive."]},{header:!1,cells:["The translator that fixes it is written but not turned on","scripts/document_link.py (3 August) plus the edit to publish_bid_documents.py accept both spellings. Both are uncommitted and unapproved. This is entry B1 of docs/PROPOSED-CHANGES.md. A commit-based deploy keeps the bug; a folder copy publishes five Tennessee files on the first run, not 84 — the other 79 have no cluster. Nobody has chosen yet."]},{header:!1,cells:["The buyer on the board is the AI's own words",'The snapshot has "buyer": "" for Bid B; the card says "Tennessee Central Procurement Office". Only 1 of 28 bids has a real buyer, and only because "TWRA" appears in its title. Nothing is inferred by the engine on purpose, so the guess arrives later, from the judge, and clustering then trusts it.']},{header:!1,cells:["There is no detail page, and scope lives only inside the PDF","Pass 1 judges almost every bid on its title alone, and a SKIP there means the PDF is never opened. 1 of 28 rows in this snapshot has a description."]},{header:!1,cells:["The one YES has been carried, unchanged, since 23 June",'19 straight archive days show 32110-82026 at score 88. The daily report and the funnel both print "1 YES" every time. Neither is lying; neither says the decision is 5 weeks old.']},{header:!1,cells:["The first 14 archive days produced zero OPENs","From 3 June to 22 June, Pass 1 said SKIP to everything and the verdicts file stayed empty. A portal can look healthy and produce nothing for three weeks."]},{header:!1,cells:['stats.json reports endpoint: "https://www.tn.gov"',"That is the site's front door, not a source. The two real list pages are in bids/index.json under endpoints."]},{header:!1,cells:["Bare Python is blocked at the TLS handshake","The list pull must drive a real Chromium. It is still anonymous public content. On 28 July the first attempt got net::ERR_CONNECTION_RESET and the retry saved the run."]},{header:!1,cells:['A "maybe" never leaves the portal folder',`Only "yes" is forwarded for non-federal portals. A Tennessee maybe is archived on disk and never becomes a board card. The publisher's own description says it forwards yes and maybe, so one of the two is drift.`]},{header:!1,cells:["The repo cannot decide whether Tennessee is a core state","This portal's sweep flags every yes as out_of_core_state, while the other two Tennessee portals — publicnotice-tn and metro-nashville — are both labelled in-core, and this portal's own config calls Tennessee a storm state. Someone has to pick one."]},{header:!1,cells:["A second, older copy of this portal's code still sits on disk","open folders/platforms/tennessee-cpo/pull_bids.py has its own bids, runs and daily folders from the retired sweep. Nothing dispatches it. It should be confirmed dead before it confuses someone."]}]],paragraphs:[]},{heading:"Where the map and the disk disagree",tables:[[{header:!0,cells:["Claim in docs/portal-dataflow/tennessee-cpo.md","What the files say"]},{header:!1,cells:['"28 open bids in the last archive (2026-07-23)" and "9 NEW on 2026-07-23"',"Correct for its own date. It was written against the 23 July run; this page is the 28 July run, which had 28 in the snapshot and 2 new. The map is one run behind, not wrong."]},{header:!1,cells:['"only 1 of 28 rows has description/page_text/contact"',"Still true on 28 July. Verified by counting the snapshot."]},{header:!1,cells:['On the dropped documents: "No normalizer exists anywhere between the two (grepped scripts/ and open folders/_lib/)"','Now stale. True when the map was written on 27 July, and true on the anchor night. One exists today: scripts/document_link.py, written 3 August, and publish_bid_documents.py was rewired to it. Neither is committed or approved, so the current nightly run still drops the files, but "no normalizer exists" is no longer the reason.']},{header:!1,cells:[`"a TN-only cluster has no bid_documents, so it gets a neutral status='no_material' row instead of real requirements"`,`Three corrections. Bid B's cluster is not TN-only — bidnet and napc are in it, and it does have bid_documents, four rows the BidNet path uploaded. Its requirements were extracted from those four files (status "ok", four source_doc_ids), not from a fallback. Page text would count as material too, and Tennessee's is on the board, but it arrived a day after the extraction. And the neutral row, when one is written, uses status: "partial", not "no_material", because the deployed front end crashes on any status it does not know. The model field is what marks it as a coverage row.`]},{header:!1,cells:["Stage 7's inputs do not list runs/judge-input.json","It is read. The filter picks its rows out of that 28-row pool. Small gap in the map, no effect on behaviour."]}]],paragraphs:["Generated 5 August 2026 by /portal-stages-visualise from the run of 28 July 2026. Every record above was read off disk from the named file; every count traces to daily/2026-07-28/stats.json, a row count, a byte size, or a line in data/tennessee-cpo/logs/pull_log.txt. The stage 11-12 claims about the board — the cluster's members, its bid_documents rows and its bid_requirements row — were read back from the live board on 5 August, not inferred from the scripts. Nothing on this page is an example. Baseline map: docs/portal-dataflow/tennessee-cpo.md (evidence-cited to file:line). Design copied from Portal pedia · 02 (DemandStar)."]}],h="Generated 5 August 2026 by /portal-stages-visualise from the run of 28 July 2026. Every record above was read off disk from the named file; every count traces to daily/2026-07-28/stats.json, a row count, a byte size, or a line in data/tennessee-cpo/logs/pull_log.txt. The stage 11-12 claims about the board — the cluster's members, its bid_documents rows and its bid_requirements row — were read back from the live board on 5 August, not inferred from the scripts. Nothing on this page is an example. Baseline map: docs/portal-dataflow/tennessee-cpo.md (evidence-cited to file:line). Design copied from Portal pedia · 02 (DemandStar).",c="docs/portal-dataflow/pedia-tennessee-cpo.html",p={slug:e,title:t,eyebrow:s,headline:n,lede:a,funnel:o,funnel_note:i,legend:r,stages:l,sections:d,footer:h,source_page:c};export{p as default,s as eyebrow,h as footer,o as funnel,i as funnel_note,n as headline,a as lede,r as legend,d as sections,e as slug,c as source_page,l as stages,t as title};

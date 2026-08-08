const e="texas-esbd",t="Texas ESBD: what happens to a bid, stage by stage",s="Portal pedia · 47",a="Texas ESBD: what happens to a bid, from a JSON service to the board",n="Every stage of the run of 28 July 2026, with a real record from the actual file at each step. Two bids are followed the whole way. One never gets past a title read. The other ends on the board as a YES at score 93. Texas is the biggest single vein of tree and brush work we have, and this run shows exactly why.",o=[{value:"792",label:"in snapshot"},{value:"109",label:"new tonight"},{value:"7",label:"opened tonight"},{value:"7",label:"judged tonight, all 7"},{value:"4",label:"yes tonight"},{value:"38",label:"open, live set"},{value:"20",label:"yes, live set"}],r="Sources: data/texas-esbd/daily/2026-07-28/stats.json (792 snapshot, 683 carryover, 109 new, 38 open / 754 skip, 20 yes / 5 maybe / 13 no) and data/texas-esbd/bids/all-bids.json (792 rows, 593,456 bytes). Read the last two cells carefully. The AI judge ran on only 7 bids tonight and answered 4 yes, 3 no, 0 maybe. That is all of data/texas-esbd/runs/judge-verdicts.json, 7 rows, 4,842 bytes. The 38 and the 20 are the whole live set: 31 verdicts decided on earlier nights (16 yes, 5 maybe, 10 no) plus tonight's 7. The two 7s in the strip are not a typo: every bid Pass 1 opened tonight was judged tonight, nothing waited. Same trap on the skip number: 754 is 102 titles read tonight plus 652 carried, not 754 reads.",i=["Bid A · HHS0017574 · FY27 Dental Surgery Services for AbSSLC. Already a SKIP; tonight it only rides along.","Bid B · 6501-07-001_0826 · TxDOT tree trimming and brush removal, Starr County. New tonight, ends YES at 93."],l=[{n:"0",title:"Is Texas due today?",who:"scripts/portal_due.py --batch portals",summary:["The gate looks at the newest dated folder under data/texas-esbd/daily/. If it is at least cadence_days old, the slug is printed and the portal runs. Texas is set to every 1 day.",'But the folders say otherwise. The archive jumps 2026-07-24 straight to 2026-07-28. Four days with no run, on a portal that is supposed to run daily. So "new tonight" on this page means new since 24 July: four days of arrivals landing in one run.'],cells:[{label:"In",paths:[{path:"data/texas-esbd/daily/<date>/",size:"36 archived days on record"},{path:"data/portals/registry.json",size:"cadence_days: 1"}],blocks:[],notes:["The date is pinned to UTC, not the machine's clock, so a run started near midnight lands in one day's folder and not two."],tables:[]},{label:"The last seven folders on disk",paths:[],blocks:[`2026-07-15
2026-07-16
2026-07-20
2026-07-21
2026-07-23
2026-07-24 <- what tonight is diffed against
2026-07-28 <- this page`],notes:["Seven folders across the fourteen days from 15 to 28 July, on a portal set to run every one of them."],tables:[]}],notes:[],then:"the slug is printed, so a child agent is handed the runbook"},{n:"1",title:"One child agent gets the whole portal",who:"Agent(general-purpose) → ../.claude/skills/texas-esbd-sweep/SKILL.md",summary:["Texas leads Batch C, five portals running side by side. The child owns the sweep end to end: it runs the script, dispatches the two AI passes, and checks its own coverage. If it dies, the other portals carry on and the roll-up marks Texas failed."],cells:[{label:"In → Out",paths:[{path:"../.claude/skills/texas-esbd-sweep/SKILL.md",size:"the runbook"},{path:"a running child agent",size:"no file is written here"}],blocks:[],notes:[],tables:[]},{label:"What the shared portals runbook says about this slug",paths:[],blocks:["texas-esbd (TX, ~265, Playwright enrich)"],notes:["Both halves are wrong. The real snapshot is 792, three times the stated volume, and no part of this portal has ever opened a browser. See the quirks table at the bottom."],tables:[]}],notes:[],then:"step 1 of the script: go get the whole open list"},{n:"2",title:"Pull: ask the search service, not the web page",who:"data/texas-esbd/scripts/run_daily.py → open folders/_lib/engines/esbd.py",summary:["Texas runs on NetSuite. We used to read the public browse pages, and they quietly hid about 40% of the open solicitations. Now the run POSTs the site's own search service page by page. The service reports how many records exist, so the run knows when it has them all. 33 pages, 792 records reported, 792 kept.","Plain web requests. No browser, no login, anywhere in this portal."],cells:[{label:"In → Out",paths:[{path:"POST txsmartbuy.gov/…/services/ESBD.Service.ss",size:"status = Posted"},{path:"data/texas-esbd/bids/all-bids.json",size:"593,456 bytes · 792 rows · 15 fields"},{path:"data/texas-esbd/bids/index.json",size:"331 bytes"}],blocks:[`{
 "generated_at": "2026-07-28T20:23:58.548228+00:00",
 "snapshot_total": 792,
 "source": "texas-esbd",
 "engine": "esbd",
 "endpoint": "https://www.txsmartbuy.gov/app/
 extensions/CPA/CPAMain/1.0.0/services/
 ESBD.Service.ss?c=852252&n=2",
 "esbd_posted_total_records": 792,
 "pages_scanned": 33,
 "open_total": 792
}`],notes:[],tables:[]},{label:"Real record Bid A · what 758 of the 792 rows look like",paths:[],blocks:[`{
 "bid_id": "HHS0017574",
 "solicitation_id": "HHS0017574",
 "title": "FY27 Dental Surgery Services for AbSSLC",
 "agency": "529",
 "buyer": "Health & Human Services
 Commission - 529",
 "status": "Addendum Posted",
 "due_date": "2026-07-28",
 "due_date_raw": "7/28/2026",
 "due_time": "10:30 PM",
 "posting_date": "2026-07-02",
 "state": "TX",
 "detail_url": "https://www.txsmartbuy.gov/
 esbd/HHS0017574",
 "nigp_codes": "94828-Dental Services;",
 "description": "",
 "_detail_ok": false
}`],notes:["The list service sends no scope, no contact, no attachments. description is empty on 758 of the 792 rows; only 34 rows carry one, and those were filled by a later stage on this night or an earlier one."],tables:[]}],notes:["There is no short-pull alarm here. The engine records esbd_posted_total_records in index.json but never compares it to how many rows it actually kept. Georgia and Florida both warn when those two drift apart. On the biggest of the three, a half-finished pull would look like a quiet day."],then:"compare tonight's list against the last archived one"},{n:"3",title:"Split the list: who is new, who was here before",who:"open folders/_lib/platform_sweep.py · prep()",summary:["Tonight's 792 are matched against the 797 bid ids in daily/2026-07-24/triage.json. A bid already decided keeps its old Pass 1 answer and costs nothing. Only genuinely new bids go to the AI.","The churn is bigger than the totals suggest: 683 of the 797 are still here, 114 dropped off the board, and 109 arrived. 792 minus 683 is the 109."],cells:[{label:"Out · three files plus the funnel",paths:[{path:"runs/triage-input.json",size:"25,653 bytes · 109 rows"},{path:"runs/triage-carryover.json",size:"83,625 bytes · 683 rows"},{path:"runs/judge-input.json",size:"452,275 bytes · 792 rows"},{path:"runs/_funnel.json",size:"157 bytes"}],blocks:[`{
 "date": "2026-07-28",
 "snapshot_total": 792,
 "carryover_count": 683,
 "triage_input_count": 109,
 "prior_archive_ids_compared_against": 797
}`],notes:[],tables:[]},{label:"Real record Bid B · triage-input.json",paths:[],blocks:[`{
 "idx": 666,
 "bid_id": "6501-07-001_0826",
 "title": "LOCAL LET MAINTENANCE CONTRACT,
 STARR CO, TREE TRIMMING AND BRUSH REMOVAL",
 "buyer": "Texas Department of Transportation",
 "state": "TX",
 "due_date": "2026-08-20"
}`,`{
 "idx": 0,
 "bid_id": "HHS0017574",
 "title": "FY27 Dental Surgery Services for AbSSLC",
 "buyer": "Health & Human Services
 Commission - 529",
 "state": "TX",
 "due_date": "2026-07-28",
 "detail_url": "https://www.txsmartbuy.gov/
 esbd/HHS0017574",
 "description_full": "Title: FY27 Dental Surgery
 Services for AbSSLC\\nBuyer: Health & Human
 Services Commission - 529\\nState: TX\\n
 Closes: 2026-07-28\\nSource URL: https://
 www.txsmartbuy.gov/esbd/HHS0017574\\n\\n
 RFP body (truncated to 6KB):\\n"
}`],notes:[`Look at the end of description_full: the words "RFP body" and then nothing. At this point in the night no scope has been fetched for anyone. This 452 KB file is a shell, and it is never rewritten. Stage 5 reads it, keeps the rows for the few bids that earned a fetch, and writes the scope into a separate file. Bid B's row in here is still empty after the run.`],tables:[]}],notes:["114 bids left the board tonight, and 3 verdicts went with them. The compile stage only keeps a prior verdict if the bid is still in the snapshot. Of the 34 verdicts in the 07-24 archive, 3 belonged to bids that have now dropped off: 2 NO and 1 MAYBE. No YES was lost this time. That is luck, not a guard."],then:"109 titles go to the first AI"},{n:"4",title:"Pass 1: open it or drop it, on the title alone",who:"max-triage · AI (engine/orchestrator/agents/max-triage-persona.md)",summary:["The AI sees six fields per bid: an index, the bid id, the title, the buyer, the state and the due date. No scope, because none exists yet. Default is SKIP; only plain LGS work words or a cryptic on-call utility title earn an OPEN. There is no keyword filter in front of this. Every new bid is read.","Tonight: 109 read, 7 OPEN, 102 SKIP."],cells:[{label:"Out",paths:[{path:"runs/triage-verdicts.json",size:"12,646 bytes · 109 rows"}],blocks:[`601330000047231
6504-40-001_0826
6501-75-001_0826
6501-07-001_0826 <- Bid B
6504-88-001_0826
6504-37-001_0826
6502-67-001_0826`],notes:["Add the carried decisions and the day's picture is 38 OPEN and 754 SKIP: 7 new opens plus 31 carried, and 102 new skips plus 652 carried.","All seven have the same buyer: Texas Department of Transportation. Six are local-let maintenance contracts, one is trash removal at a TxDOT yard. That pattern is why Texas is worth running."],tables:[]},{label:"Real record Bid B · opened",paths:[],blocks:[`{
 "bid_id": "6501-07-001_0826",
 "decision": "OPEN",
 "reason": "tree trimming and brush removal"
}`,`{
 "bid_id": "HHS0017574",
 "decision": "SKIP",
 "reason": "dental surgery services, medical"
}
from runs/triage-carryover.json, not triage-verdicts.json`],notes:["Bid A was decided on an earlier night. Tonight it appears in the carryover file, is copied into the day's archive, and never reaches the AI. Its cost tonight is one line of file copying. That is the whole point of the diff."],tables:[]}],notes:[],then:"only the 7 opens are worth fetching in full"},{n:"5",title:"Go get the real bid, for the few that earned it",who:"esbd.enrich_details() then platform_sweep.build_judge_input_open()",summary:["For each OPEN, one request to the detail service returns the scope, the contact, the estimated value and the attachment list. For a TxDOT letting it then walks the free Plans Online file server and swaps the useless advertisement text file for the real plans PDF, matched by the job number in the id.","Then the 792-row shell from stage 3 is read, filtered down to just these bids, and the real scope is written into that filtered copy, runs/judge-input-open.json. The 792-row file itself is left exactly as stage 3 wrote it."],cells:[{label:"In → Out",paths:[{path:"GET …/ESBD.Details.Service.ss?identification=<id>",size:"one per open bid, 0.3s apart"},{path:"https://ftp.txdot.gov/plans/…",size:"free plans and proposals"},{path:"runs/judge-input.json",size:"read, then filtered to the 7 open ids"},{path:"runs/judge-input-open.json",size:"5,084 bytes · 7 rows"}],blocks:[],notes:["The model doc misses a live behaviour here. The code also re-queues bids that were already judged, when a description grew from almost nothing to real text or an amendment field appeared, capped at 25 a night. Tonight it fired zero times: judge-input-open.json holds exactly the 7 new opens and nothing else.","Across the whole 792-row snapshot only 34 rows carry a description and a document list, and 26 carry the assembled page text. Everything else is a title. A pull keeps whatever earlier nights enriched, which is why 34 rows are filled after a night that only fetched 7."],tables:[]},{label:"Real record Bid B · the enriched snapshot row",paths:[],blocks:[`{
 "bid_id": "6501-07-001_0826",
 "title": "LOCAL LET MAINTENANCE CONTRACT,
 STARR CO, TREE TRIMMING AND BRUSH REMOVAL",
 "buyer": "Texas Department of Transportation",
 "status": "Posted",
 "nigp_codes": "91371-Maintenance And Repair,
 Highway And Road (To Include The Removal
 Of Asphalt, Concrete, Bitumens, Etc)",
 "description": "COUNTY: STARR HIGHWAY: US0083
 TYPE: TREE TRIMMING AND BRUSH REMOVAL
 EST. COST: $942,507.50",
 "_detail_ok": true,
 "documents": [
 {
 "file_name": "Starr 6501-07-001.pdf",
 "file_url": "https://ftp.txdot.gov/plans/
 Local-Let-Maintenance/2026/08%20August/
 08%20Plans/Starr%206501-07-001.pdf",
 "file_description": "TxDOT plans (Plans Online)"
 },
 {
 "file_name": "6501-07-001_0826.txt",
 "file_url": "https://www.txsmartbuy.gov/core/
 media/media.nl?id=33508172&c=852252&h=…",
 "file_description": "OFFICIAL ADVERTISEMENT"
 }
 ],
 "contact_email": "",
 "contact_phone": "956-702-6101",
 "est_value": "942507.5"
}`],notes:["Two documents: the real plans PDF from the file server, and the advertisement text file the portal itself offers. Only the first is worth reading. The email is blank; the phone number is all the contact Texas gives."],tables:[]}],notes:["The file server has a broken certificate. Texas ships an incomplete chain on ftp.txdot.gov, so certificate checking is deliberately switched off for that one host and nothing else. Without that, the free plans are unreachable. If the plans for a month are not posted yet, the bid keeps only the advertisement file. Closing that gap is the whole reason the pass at stage 11 exists."],then:"7 full bids go to the second AI"},{n:"6",title:"Pass 2: would LGS actually bid this?",who:"max-bid-judge · AI (engine/orchestrator/agents/max-persona.md)",summary:["The judge reads the whole text and answers yes, maybe or no, with a score out of 100 and the reasoning. Texas is inside the eight core states, so it is scored normally with no out-of-area flag.","Tonight, on 7 bids: 4 yes, 3 no, no maybes."],cells:[{label:"In → Out",paths:[{path:"runs/judge-input-open.json",size:"7 rows"},{path:"runs/judge-verdicts.json",size:"4,842 bytes · 7 rows"}],blocks:[`{
 "idx": 666,
 "bid_id": "6501-07-001_0826",
 "description_full": "Title: LOCAL LET MAINTENANCE
 CONTRACT, STARR CO, TREE TRIMMING AND BRUSH
 REMOVAL\\nBuyer: Texas Department of
 Transportation\\nState: TX\\nCloses: 2026-08-20\\n
 Source URL: https://www.txsmartbuy.gov/esbd/
 6501-07-001_0826\\n\\nRFP body:\\nCOUNTY: STARR
 HIGHWAY: US0083 TYPE: TREE TRIMMING AND BRUSH
 REMOVAL EST. COST: $942,507.50"
}`],notes:["Compare with the same bid's row in judge-input.json at stage 3, where the body was empty. One line of real scope is all Texas publishes for a letting, and it is enough: the county, the highway, the work, the money."],tables:[]},{label:"Real record Bid B · YES, 93",paths:[],blocks:[`{
 "bid_id": "6501-07-001_0826",
 "title": "LOCAL LET MAINTENANCE CONTRACT,
 STARR CO, TREE TRIMMING AND BRUSH REMOVAL",
 "buyer": "Texas Department of Transportation",
 "state": "TX",
 "would_lgs_bid": "yes",
 "score": 93,
 "category": "vegetation_management",
 "primary_reason": "Core Category 5 DOT tree
 trimming and brush removal at $942K on US-83 —
 the largest of this let cycle and comfortably
 above floor. Texas is a core state and this is
 exactly the corridor vegetation work our crews
 run.",
 "red_flags": [
 "thin_description_pull_rfp_packet"
 ]
}`],notes:["The red flag is the judge being honest about its own evidence: one line of scope is thin, so an operator should pull the packet before pricing."],tables:[]}],notes:[],then:"tonight's answers are folded into the standing set"},{n:"7",title:"Write the day folder, and give the numbers their meaning",who:"platform_sweep.compile_archive()",summary:["Carried decisions and tonight's are merged, then tonight's 7 verdicts are laid on top of the still-live ones from earlier nights. The result is one folder that stands on its own.","The arithmetic closes exactly: 31 carried verdicts (16 yes, 5 maybe, 10 no) plus tonight's 7 (4 yes, 3 no) = 38 rows = 20 yes, 5 maybe, 13 no. And 31 carried opens plus 7 new opens = the 38 opens in the day's triage file."],cells:[{label:"Out · data/texas-esbd/daily/2026-07-28/",paths:[],blocks:[],notes:["Never add this portal's scoring.yes to another portal's. It is the live standing set, so summing across portals or across days counts the same bid many times."],tables:[[{header:!0,cells:["File","Holds","Size"]},{header:!1,cells:["new-bids.json","792 rows, the whole snapshot","593,456 B"]},{header:!1,cells:["triage.json","792 decisions, tomorrow's memory","96,268 B"]},{header:!1,cells:["verdicts.json","38 live verdicts, not 38 judged tonight","30,940 B"]},{header:!1,cells:["stats.json","the funnel counts","449 B"]},{header:!1,cells:["report.md","the human summary","11,987 B"]}]]},{label:"Real record Bid B · daily/2026-07-28/verdicts.json",paths:[],blocks:[`{
 "bid_id": "6501-07-001_0826",
 "title": "LOCAL LET MAINTENANCE CONTRACT,
 STARR CO, TREE TRIMMING AND BRUSH REMOVAL",
 "buyer": "Texas Department of Transportation",
 "would_lgs_bid": "yes",
 "score": 93,
 "category": "vegetation_management",
 "red_flags": ["thin_description_pull_rfp_packet"],
 "bid_key": "texas-esbd:6501-07-001_0826",
 "verdict": "yes"
}`,`{
 "bid_id": "HHS0017574",
 "decision": "SKIP",
 "reason": "dental surgery services, medical"
}`],notes:["Two new fields appear at this boundary: verdict (the standard name every later stage reads) and bid_key. Agents have written the answer under two different names over time, so the compile step normalises both here."],tables:[]}],notes:[],then:"the portal's own night ends, and the shared machinery takes over"},{n:"8",title:"Carry forward: deliberately off for this portal",who:"2.5 · scripts/carry_forward_verdicts.py --all",summary:["Some portals need a safety net that re-attaches yesterday's verdicts. Texas does not: the registry marks it carry_forward: engine-internal, which means the sweep already does it twice on its own: Pass 1 decisions at stage 3, Pass 2 verdicts at stage 7. The shared script asks the registry which portals to run on and filters this one out.","Running it by hand would apply the merge a second time on top of an already-merged file."],cells:[{label:"Evidence that it was run here anyway, at least twice in the past",paths:[],blocks:[`rows in daily/2026-07-28/verdicts.json carrying _first_judged: 12 of 38

_first_judged = 2026-06-23 696-AG-26-P023
_first_judged = 2026-06-23 RFP-Groundskeeping
_first_judged = 2026-07-15 26-095
_first_judged = 2026-07-15 6501-77-001_0726
_first_judged = 2026-07-15 601330000046456
_first_judged = 2026-07-15 405-26R0016911
_first_judged = 2026-07-15 RFP2026-028
_first_judged = 2026-07-15 RFP2026-027
_first_judged = 2026-07-15 6489-35-001_0826
_first_judged = 2026-07-15 6500-51-001_0826
_first_judged = 2026-07-15 6505-46-001_0826
_first_judged = 2026-07-15 6505-48-001_0826`],notes:["Only the shared carry-forward script writes _first_judged. It should never have touched this portal. Two dates are stamped, 23 June and 15 July, and once stamped the field rides forward every night through the verdict merge at stage 7. The stamps are harmless in themselves; they are proof the guard is a convention, not a lock."],tables:[]}],notes:[],then:"every portal's day folders are read together"},{n:"9",title:"The ledger, the report, and the board fixture",who:"2.6 portals_cumulative.py · 2.7 standardize_daily_reports.py · 2.8 dump_yes_for_portalpro.py",summary:["Three shared steps in a row. The ledger walks all 36 of this portal's day folders and splits still-open from closed. The report writer overwrites the report the sweep just wrote, using one layout shared by every portal. The fixture dump keeps the YES verdicts, joins each to the newest snapshot row and overlays the enriched fields."],cells:[{label:"Out",paths:[{path:"data/portals/cumulative-yes.json + .md",size:"all portals"},{path:"data/texas-esbd/daily/2026-07-28/report.md",size:"rewritten, 11,987 bytes"},{path:"PortalPro/src/fixtures/portal-bids.json",size:"1,470 cards · 65 texas-esbd"}],blocks:[],notes:[`MAYBE never reaches the board. The dump gives yes-and-maybe only to federal portals; Texas is not one, so it gets yes only. All 65 Texas cards in the fixture are verdict "yes". The 5 live maybes stay in the day folder and no human sees them. None of the 5 was judged tonight; tonight's 7 verdicts were 4 yes and 3 no. All five are carried from earlier nights and have been invisible ever since.`],tables:[]},{label:"Real card Bid B on the board",paths:[],blocks:[`{
 "id": "c8a65e9e86ff2753",
 "portal": "texas-esbd",
 "source_bid_id": "6501-07-001_0826",
 "title": "LOCAL LET MAINTENANCE CONTRACT,
 STARR CO, TREE TRIMMING AND BRUSH REMOVAL",
 "buyer": "Texas Department of Transportation",
 "state": "TX",
 "federal": false,
 "score": 93,
 "verdict": "yes",
 "description": "COUNTY: STARR HIGHWAY: US0083
 TYPE: TREE TRIMMING AND BRUSH REMOVAL
 EST. COST: $942,507.50",
 "due_date": "2026-08-20",
 "contact_name": null,
 "contact_email": null,
 "contact_phone": "956-702-6101",
 "first_seen": "2026-07-28",
 "last_seen": "2026-07-28",
 "has_documents": false
}`],notes:["The paperclip lies on night one. The snapshot row for this bid lists two documents, but the card says false. The flag is not read from the snapshot. It is looked up in the shared database's document table by portal and bid id, and the documents are not uploaded there until stages 11 and 12, which run after this dump. 61 of the 65 Texas cards say true; this one is brand new tonight. A one-night lag, not a lost file."],tables:[]}],notes:[],then:"the bid stops being Texas-shaped"},{n:"10",title:"Publish, cluster, and merge the duplicates",who:"2.85 · publish_to_supabase.py → llm_dedup_candidates.py → bid-dedup-judge → apply_llm_dedup.py",summary:["The YES cards are pushed into the shared bids table, then grouped into clusters with every other portal's bids, and an AI confirms which cross-portal pairs are the same solicitation. The same Texas solicitation turns up on DemandStar, on IonWave and on CivCast. After this stage it is one row for the operator.","The title-overlap map (data/portals/overlap.json, built 24 July, so a different night from this run) finds 60 Texas titles that also show up on DemandStar, 14 on IonWave, 9 on CivCast and 5 on NAPC. It matches on normalised titles across each portal's latest snapshot, which is not the test the AI runs at this stage, and it carries no titles at all for several portals including BidNet. Read it as a floor on the duplication, not a ranking."],cells:[{label:"Writes",paths:[],blocks:[],notes:["This stage is a hard gate for the next one. The Texas document pass finds its work by cluster id and skips anything that has none. A bid that fails to publish here gets no documents at all, silently."],tables:[[{header:!1,cells:["bids","upsert keyed on portal + source bid id"]},{header:!1,cells:["clusters","created or collapsed; every bid gets a cluster id"]},{header:!1,cells:["sweep_runs","one row per portal per run date, from stats.json"]},{header:!1,cells:["data/portals/llm-dedup-candidates.json","the pairs worth an AI look"]}]]}],notes:[],then:"now go get the packet the portal hides behind a button"},{n:"11",title:"The Texas-only document pass",who:"2.86a · open folders/_lib/texas_esbd_doc_capture.py",summary:["The detail page has a Download PDF button that hands over the real solicitation packet. This pass reproduces what that button does, in three plain web requests: warm a session, read the site's current download address out of its own config, fetch the PDF. It checks both the content type and the file's first bytes before believing it is a PDF.","It runs for every live yes or maybe Texas bid whose cluster is missing that packet. The advertisement text file does not count as having it."],cells:[{label:"In → Out",paths:[{path:"bids where portal = texas-esbd, verdict in (yes, maybe), status live",size:null},{path:"GET …/shopping.environment.ssp",size:"the rotating download address"},{path:"bid-docs/{cluster_id}/documents/{ts}-{name}",size:"45 MB cap"},{path:"bid_documents",size:"one row per file"}],blocks:[],notes:[],tables:[]},{label:"Why it exists, and how it fails",paths:[],blocks:[],notes:["No browser here either. Three ordinary web requests against public endpoints, no login. The one place in the repo that describes this pass in writing gets it right; four other places still call this portal a browser portal."],tables:[[{header:!1,cells:["Why","an operator report on 23 July: surfaced Texas bids carried only the advertisement text file, never the real packet"]},{header:!1,cells:["Token rotates","the address is re-fetched every run; if the answer is not a PDF the session is warmed once more, then it gives up"]},{header:!1,cells:["No cluster","nothing happens for that bid, and nothing says so"]},{header:!1,cells:["Missing credentials file","the whole pass dies"]},{header:!1,cells:["Second chance","a later backstop step re-runs this same command for bids that still have no documents"]}]]}],notes:[],then:"then the shared passes sweep every portal"},{n:"12",title:"The shared document pass, then reading the documents",who:"2.86b publish_bid_documents.py + publish_page_text.py · 2.87 requirements",summary:["One shared pass downloads every document address the engine recorded, which for Texas is the TxDOT plans PDF and the advertisement file, and files them under the cluster. Another pushes the assembled page text into the shared table. They run after the Texas-only pass on purpose, so nothing publishes a bid as document-free before its packet lands.","Then the text is pulled out of each cluster's documents and an AI reads it for the real bid requirements, quoted word for word. Requirements are stored per cluster, not per portal, so a Texas bid and its DemandStar twin share one set."],cells:[{label:"What reaches this stage from Texas",paths:[],blocks:[],notes:[],tables:[[{header:!1,cells:["Documents","only the 34 enriched snapshot rows have any; the other 758 have none to publish"]},{header:!1,cells:["Page text","26 rows carry it. Texas has no public detail page, so the text is assembled from the JSON answer: title, contact, value, document names, then the scope"]},{header:!1,cells:["Two roads, one cluster","the packet from stage 11 and the recorded addresses here both land in the same place and are matched on file name so nothing is stored twice"]},{header:!1,cells:["Requirements","never skipped by rule; a doc-bearing cluster with no requirements row is a bug"]}]]}],notes:[],then:"blanks are filled, so new pairs become comparable"},{n:"13",title:"Duplicate check, second pass",who:"2.875 · llm_dedup_candidates.py → bid-dedup-judge → apply_llm_dedup.py",summary:["Enrichment just filled in buyers and due dates that were blank the first time round. Pairs that could not be compared at stage 10 now can be, so the check runs again on that residue only. If there are no new pairs it stops; nothing is re-applied from a stale file.","The model doc says Texas gains the most here, because a TxDOT letting supposedly sits with an agency number as its buyer until the detail service fills the name in. That is not what tonight's files show. Bid B already had a full buyer name at stage 3, before anything was fetched."],cells:[{label:"Real record Bid B · both fields, written at pull time",paths:[],blocks:[`{
 "bid_id": "6501-07-001_0826",
 "agency": "601",
 "buyer": "Texas Department of Transportation"
}`],notes:['The number stays in agency and the name goes in buyer, both at pull. The engine takes the name off the list record and, when that is blank, looks the number up in a 400-entry table it ships with (esbd_agencies.json, where 601 is exactly "Texas Department of Transportation"). The second dedup pass still runs; the buyer-number gap the model doc gives as its reason did not apply to this bid.'],tables:[]}],notes:[],then:"what changed since the last run?"},{n:"14",title:"Notice changes, send the mail, check the run",who:"2.88 · watch_list_signals.py · bid_watch.py · new_bids_email.py · pipeline_sentinel.py",summary:["Tonight's snapshot is compared with the last archived one for free change markers, then the digests go out and the sentinel checks that every phase actually ran.",'Texas has no second-look watch recipe, but it does not need one for addenda: it publishes "Addendum Posted" as a plain status value, the snapshot keeps that field, and the watcher matches that exact string. On this run 155 of the 792 rows carry that status and 637 say "Posted".'],cells:[{label:"What fires and what does not",paths:[],blocks:[],notes:[],tables:[[{header:!1,cells:["Addendum signal","works, on the status string. Bid A's own status tonight is Addendum Posted"]},{header:!1,cells:["Addendum counter","Texas has no counter, so the number-based branch never applies"]},{header:!1,cells:["Due date and status change","both fire from the same snapshot compare"]},{header:!1,cells:["The email digests","silently do nothing until the mail key is set in data/auth/resend.env"]},{header:!1,cells:["Sentinel","writes data/portals/sentinel.json and exits non-zero if any portal is red"]}]]}],notes:[],then:"and finally, in front of a person"},{n:"15",title:"Packs, boards, and the numbers that get reported",who:"2.89 build_bidpack.py · 2.9-2.96 boards · 3-4.99 roll-up + scorecard.py",summary:["Every keyed cluster is rendered into a folder of plain text: the bid summary, the page text, the requirements, the full document text. A Texas bid shows up inside its cluster's pack as page-texas-esbd.md. Then the operator boards are rebuilt and the scorecard asks the shared database for the only YES numbers we report out loud.","The end is not the database. The end is the board at shessi.dev/lgs, the morning email, and the pack folder an estimator opens."],cells:[{label:"Proof this portal really lands in a pack",paths:[{path:"data/bidpacks/tx-city-of-waco-m1612-rfb-2026-027-mowing-and-grounds-maintenance-for-high-low-r-d8bb0d/page-texas-esbd.md",size:null},{path:"data/bidpacks/tx-health-human-services-commission-529-as-needed-tree-trimming-grinding-and-rem-50e091/docs/",size:null}],blocks:[],notes:["One number rule. The YES count we report comes from the scorecard, which queries the shared database once. It is not the sum of any portal's scoring.yes, and for this portal that field is the live standing set anyway."],tables:[]}],notes:[],then:null}],d=[{heading:"The quirks that bite",tables:[[{header:!0,cells:["Quirk","Consequence"]},{header:!1,cells:["Only bids the first AI opened ever get a scope, a contact or documents","34 of 792 rows are filled; the other 758 are a title and some dates, forever. Anything downstream that reads the snapshot sees mostly blanks"]},{header:!1,cells:["The pull has no short-pull alarm","Georgia and Florida warn when the count they kept drifts from the count the site reported. Texas records both numbers and never compares them. A half-finished pull looks like a quiet night"]},{header:!1,cells:["Four places call this a browser portal: run_daily.py:5, both skill files, and a stale comment in the engine","nothing here has ever imported a browser. Every step is a plain web request. Anyone sizing the runtime or chasing a browser dependency chases a ghost"]},{header:!1,cells:["The shared portals runbook says ~265 bids a day","the real snapshot is 792. That number predates the switch to the search service. An operator reading it sees a normal night as a 3x spike"]},{header:!1,cells:["stats.json.endpoint is the browse page, not the service actually called","the real endpoint is only in bids/index.json. Do not quote stats.json when debugging the pull"]},{header:!1,cells:["MAYBE verdicts never reach the board",'the fixture dump surfaces yes-only for non-federal portals. All 65 Texas cards are "yes"; the 5 live maybes stay on disk and nobody sees them. all 5 are carried from earlier nights, and the judge returned no maybe tonight']},{header:!1,cells:["has_documents is false on a card whose snapshot row lists two files","the flag reads the shared document table, which is not filled until two stages after the card is written. New bids show no paperclip for one night. 61 of 65 cards say true"]},{header:!1,cells:["_first_judged stamped on 12 of 38 verdict rows, dated 23 June and 15 July","only the shared carry-forward script writes it, and it must never run on this portal. It did, twice. The stamps ride forward through every later merge"]},{header:!1,cells:["A bid that drops out of the snapshot loses its verdict","114 ids left tonight, taking 3 verdicts with them (2 no, 1 maybe). No YES was lost this time. Nothing checks"]},{header:!1,cells:["The advertisement text file is not the bid packet","the real proposal and plans live on a free Texas file server whose certificate chain is broken, so checking is switched off for that one host. The extra document pass exists purely to close this gap"]},{header:!1,cells:["detail_url is forced to /esbd/<id>","the record's own link field is a generic agency homepage for TxDOT lettings, which would land the operator on a page with no bid on it"]},{header:!1,cells:["Four files in runs/ nobody writes and nobody reads","_triage_list.txt, _triage_b1.txt, _triage_b2.txt (all 18 June) and _triage_decisions.json (12 June, 95 rows). They look like leftovers from a hand-split triage. Georgia and Florida have no equivalent"]},{header:!1,cells:["config.fetch_detail is true and is never used",'it reads as "the pull enriches everything". It does not. Georgia and Florida both act on the same setting']},{header:!1,cells:["The old web-page parser is still in the engine","orphaned when the pull switched to the search service. Nothing calls it"]},{header:!1,cells:["A whole second copy of this portal exists at open folders/platforms/texas-esbd/","nothing in the live flow reads it, but PORTAL.md still lists its script as live code. Someone will edit the wrong file"]},{header:!1,cells:["data/texas-esbd/PORTAL.md is a 14 July auto-draft",'it says health "paywalled" (Texas has no paywall and 100% document coverage on the surfaced set), "enrich passes: none" (there is one, every day), and carries a DemandStar $5 note that has nothing to do with Texas']},{header:!1,cells:["Cadence says every day; the archive jumps 07-24 to 07-28","four days of arrivals piled into one run, so tonight's 109 new bids are four days' worth, not one day's. The gate is not the thing failing. Nothing dispatched"]}]],paragraphs:[]},{heading:"Where this page and the model doc disagree",tables:[[{header:!0,cells:["The model doc says","The files say"]},{header:!1,cells:["797 snapshot, 40 new, 34 open, 16 yes, from the run of 2026-07-24","792, 109, 38, 20, from the run of 2026-07-28. Expected: the doc was written against the earlier run. This page uses the later one throughout"]},{header:!1,cells:["15 of 34 verdict rows carry _first_judged","12 of 38 now, dated 23 June and 15 July"]},{header:!1,cells:["Its enrich-stage in/out table leaves runs/judge-input.json out of the inputs (its flow diagram does draw the edge, so only the table is short)","stage 5 reads it at platform_sweep.py:283, filters it to the open ids, and writes the scope into judge-input-open.json at :299. So it is an input, not a write-only file, and it is never rewritten in place"]},{header:!1,cells:["No mention of re-judging","the code re-queues an already-judged bid when its scope grows from almost nothing to real text, or an amendment field appears, capped at 25 a night. It fired zero times tonight"]},{header:!1,cells:["TxDOT lettings arrive with only an agency number as buyer, filled in later",'the buyer name is written at pull time, from the list record or from the engine’s own 400-entry agency table. Bid B already read "Texas Department of Transportation" in runs/triage-input.json, before any detail fetch']},{header:!1,cells:["Line cites like platform_sweep.py:112 for the triage-input write and :187 for the judge-input-open write","that first write is at :124 now, 12 lines down; the second is at :299, 112 lines down. The shared sweep glue was refactored, so every line cite in the doc is stale by anything from a dozen lines to a hundred. Every file path and every step in the flow still holds"]}]],paragraphs:["Generated 5 August 2026 by /portal-stages-visualise from the run of 28 July 2026. Every record above was read from the named file on disk; every count traces to daily/2026-07-28/stats.json, a row count, or a file size in bytes. The one exception is the duplicate-overlap figures at stage 10, which come from data/portals/overlap.json and are dated 24 July, not this run. Baseline map: docs/portal-dataflow/texas-esbd.md (evidence-cited to file:line). Facts file: docs/portal-dataflow/pedia-inspect/texas-esbd.json. Both tracer bids exist; neither was invented."]}],h="Generated 5 August 2026 by /portal-stages-visualise from the run of 28 July 2026. Every record above was read from the named file on disk; every count traces to daily/2026-07-28/stats.json, a row count, or a file size in bytes. The one exception is the duplicate-overlap figures at stage 10, which come from data/portals/overlap.json and are dated 24 July, not this run. Baseline map: docs/portal-dataflow/texas-esbd.md (evidence-cited to file:line). Facts file: docs/portal-dataflow/pedia-inspect/texas-esbd.json. Both tracer bids exist; neither was invented.",c="docs/portal-dataflow/pedia-texas-esbd.html",p={slug:e,title:t,eyebrow:s,headline:a,lede:n,funnel:o,funnel_note:r,legend:i,stages:l,sections:d,footer:h,source_page:c};export{p as default,s as eyebrow,h as footer,o as funnel,r as funnel_note,a as headline,n as lede,i as legend,d as sections,e as slug,c as source_page,l as stages,t as title};

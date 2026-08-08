const e="beaconbid",t="BeaconBid: what happens to a bid, stage by stage",a="Portal pedia · 06",s="BeaconBid: what happens to a bid, from a stolen request to the board",n="Every stage of the run, with a real record from the actual files at each step. Two bids are followed the whole way. One was thrown out on an earlier day and never re-read. The other reaches the board as a YES at score 88. All data is from the run of 28 July 2026.",o=[{value:"235",label:"in snapshot"},{value:"182",label:"carried over"},{value:"53",label:"new tonight"},{value:"13",label:"triage says open"},{value:"5",label:"judged tonight"},{value:"4",label:"yes"},{value:"0",label:"maybe"}],r="Sources: data/beaconbid/daily/2026-07-28/stats.json (458 bytes) and data/beaconbid/bids/all-bids.json (235 rows, 326,275 bytes). 222 bids were skipped at triage. Of the 13 OPENs, 8 already had a verdict from an earlier day, so only 5 went to the judge (runs/judge-input-open.json, 5 rows), giving 2 YES and 3 NO. The other 2 YES and 6 NO were carried, not re-scored. 9 NO in total.",i=["Bid A · 5fa20eab… · PTG RFP-2026-07 Recycling Center Construction, Pechanga Band of Indians. Was skipped on an earlier day; carried, never re-read.","Bid B · 24955ed3… · RFP026-006 Disaster Debris Removal, San Patricio County. New tonight. Ends as YES, score 88."],d=[{n:"0",title:"Is BeaconBid even due tonight?",who:"scripts/portal_due.py --batch portals",summary:["BeaconBid is not swept every day. The gate looks at the newest dated folder under data/beaconbid/daily/. If it is three or more days old, the portal is due and a child agent is sent to run it. If not, it is skipped and nothing is lost, because the sweep compares against its own archive anyway.","There are 33 dated folders on record. The previous pull, per the log, was 23 July, five days before this one."],cells:[{label:"In",paths:[{path:"data/portals/registry.json",size:"the beaconbid entry"},{path:"data/beaconbid/daily/*/",size:"33 dated folders"}],blocks:[],notes:[],tables:[]},{label:"The real registry entry that decides it",paths:[],blocks:[`{
 "slug": "beaconbid",
 "label": "BeaconBid",
 "engine": "beaconbid",
 "batch": "portals",
 "cadence_days": 3,
 "authed": false,
 "enrich_passes": [],
 "watch": "none",
 "in_cumulative": true,
 "in_portalpro": true,
 "carry_forward": "engine-internal"
}`],notes:['Two fields here are wrong. enrich_passes says none, but scripts/enrichers.py:83 registers a live pass for this portal. And the portals skill text says "1 pull/day" while the only number any code reads is this cadence_days: 3.'],tables:[]}],notes:[],then:"a real browser opens the site, because a plain request is refused"},{n:"1",title:"Pull: steal the site's own request",who:"data/beaconbid/scripts/run_daily.py (step 1: ps.pull)",summary:['BeaconBid will not answer a plain machine request. A bare POST to its data endpoint comes back "Not allowed", and it only accepts a fixed list of approved question shapes, so we cannot write our own. So a headless Chromium opens the solicitations page, watches the page make its own request, copies that request body word for word, and replays it 50 rows at a time until the list runs out.',"The reply already carries the full scope text as HTML. The tags are stripped and the plain words are kept. That is why this portal is not title-only."],cells:[{label:"In → Out",paths:[{path:"https://www.beaconbid.com/solicitations",size:"the page, opened for real"},{path:"bids/all-bids.json",size:"326,275 bytes · 235 rows"},{path:"bids/index.json",size:"230 bytes"},{path:"logs/pull_log.txt",size:"appended, 286 lines to date"}],blocks:[`[2026-07-28T21:07:23…] BeaconBid pull · GraphQL
 ListSolicitations via Playwright in-page fetch
[…:28] page 0: 50 docs (total 237, collected 50)
[…:29] page 1: 50 docs (total 237, collected 98)
[…:29] page 2: 50 docs (total 237, collected 148)
[…:30] page 3: 50 docs (total 237, collected 198)
[…:31] page 4: 37 docs (total 237, collected 235)
[…:31] page 5: 0 docs (total 237, collected 235)
[…:33] wrote 235 open solicitations`],notes:["The site said 237. We wrote 235. Page 1 reported 50 rows but the collected count only rose by 48, and page 5 came back empty. Two rows were either duplicates or never handed over. Nothing compares the collected count against the site's own total."],tables:[]},{label:"Real record Bid A",paths:[],blocks:[`{
 "bid_id": "5fa20eab-445a-44c4-80cd-c256f0e1accd",
 "title": "PTG RFP-2026-07 Recycling Center
 Construction",
 "buyer": "Pechanga Band of Indians",
 "state": "MULTI",
 "due_date": "2026-07-28",
 "due_date_raw": "2026-07-28T23:00:00.000Z",
 "category": "{'code': '84', 'name': 'General
 Construction (Buildings, Facilities,
 Offices Etc",
 "solicitation_no": "PTG RFP-2026-07",
 "status": "Open",
 "detail_url": "https://www.beaconbid.com/
 solicitations/pechanga-band-of-indians/
 5fa20eab-445a-44c4-80cd-c256f0e1accd",
 "description": "NOTICE TO POTENTIAL BIDDERS PTG
 Non-Disclosure Agreement must be signed and
 emailed to orders@pechanga-nsn.gov. Once
 received the official RFP will be released.…",
 "_detail_ok": true
}`],notes:["Look at category. It is a Python dictionary that was printed into a string and then cut off mid-word at 60 characters. The closing brace is gone. Nothing downstream can read it, and the board card shows category as empty."],tables:[]}],notes:[`Two things to know about this stage. First, there is no floor guard. If the page's own request is not seen within 40 seconds, the engine writes an empty snapshot with the note "error": "no_query_captured" straight over a healthy 235-row file (open folders/_lib/engines/beaconbid.py:118-126). Another portal's engine has that guard; this one does not. Second, a re-pull the same day cannot wipe what we already learned: the writer carries forward any enriched value the new row leaves blank (open folders/_lib/common.py:119-138).`],then:"today's list is compared against yesterday's decisions"},{n:"2",title:'Split the list into "seen before" and "never seen"',who:"data/beaconbid/scripts/run_daily.py (step 2: ps.prep)",summary:["Today's 235 bids are matched against the newest daily/<date>/triage.json. Anything already decided keeps its old decision and becomes carryover: 182 bids, which cost nothing. Only the 53 bid ids that have never been seen go to the AI.","This is where Bid A's night effectively ends. It was decided on an earlier day, so it is copied straight into the carryover file with the same reason it got before."],cells:[{label:"Out: four files",paths:[{path:"runs/triage-input.json",size:"12,558 bytes · 53 rows"},{path:"runs/triage-carryover.json",size:"34,646 bytes · 182 rows"},{path:"runs/judge-input.json",size:"336,677 bytes · 235 rows"},{path:"runs/_funnel.json",size:"156 bytes"}],blocks:[`{
 "date": "2026-07-28",
 "snapshot_total": 235,
 "carryover_count": 182,
 "triage_input_count": 53,
 "prior_archive_ids_compared_against": 230
}`],notes:[],tables:[]},{label:"Real records Bid A: carriedBid B: new",paths:[],blocks:[`{
 "bid_id": "5fa20eab-445a-44c4-80cd-c256f0e1accd",
 "decision": "SKIP",
 "reason": "building construction, wrong
 vertical"
}`,`{
 "idx": 83,
 "bid_id": "24955ed3-377f-4209-a19d-45848c47a42e",
 "title": "RFP026-006 Disaster Debris Removal",
 "buyer": "San Patricio County",
 "state": "MULTI",
 "due_date": "2026-08-06"
}`],notes:["Bid B is row 83 of the snapshot, not row 83 of this file. triage-input.json holds 53 rows whose idx values run from 11 to 234. Anyone treating idx as a position in the file will read the wrong bid."],tables:[]}],notes:["The biggest file the sweep writes is not for the judge. judge-input.json is 336,677 bytes and holds all 235 bids with their scope text. The judge never sees it. It is read once, at open folders/_lib/platform_sweep.py:281, purely as the source of rows for the much smaller open-only file built at stage 5. Also note: the prior-triage load includes today, so re-running the same day gives 0 new and costs nothing."],then:"53 titles go to the AI, and Bid A is not among them"},{n:"3",title:"Pass 1: worth a real read, or not?",who:"max-triage · AI → runs/triage-verdicts.json",summary:["The AI gets six fields per bid: an index, the bid id, title, buyer, state and close date. No scope text at this pass. The default answer is SKIP. Words that describe work LGS actually does flip it to OPEN.","Of the 53 new bids: 48 SKIP, 5 OPEN. Bid B is one of the five."],cells:[{label:"In → Out",paths:[{path:"runs/triage-input.json",size:"53 rows"},{path:"runs/triage-verdicts.json",size:"11,655 bytes · 53 rows"}],blocks:[],notes:["Bid A never reached this stage. It is not in triage-input.json and not in triage-verdicts.json. Its whole cost tonight was being pulled and matched against a decision made on an earlier day. That is the diff working exactly as intended.","Add the 8 OPENs sitting in the carryover file and the day totals 13 OPEN and 222 SKIP, the two numbers in stats.json."],tables:[]},{label:"Real record Bid B: opened",paths:[],blocks:[`{
 "idx": 83,
 "bid_id": "24955ed3-377f-4209-a19d-45848c47a42e",
 "title": "RFP026-006 Disaster Debris Removal",
 "decision": "OPEN",
 "reason": "Debris removal/hauling IS LGS work
 (DRC)"
}`],notes:[],tables:[]}],notes:[],then:"the OPENs are supposed to get their detail page visited here"},{n:"4",title:"The detail visit that did not happen",who:"ps.enrich_opens → open folders/_lib/engines/beaconbid.py:157-256",summary:["This stage is meant to open each OPEN bid's own page, catch the reply, and fill in the buyer's contact, a longer description, the document names and a page-text blob.","On 28 July it did not run at all. The pull log has no enrich_details line for that date. The next one is the following morning, and it touched two bids, not five.","The reason is a one-word field. At pull time the engine sets _detail_ok = bool(desc), which is true whenever the list already carried a description (open folders/_lib/engines/beaconbid.py:90). This stage then picks its targets as the OPEN bids where _detail_ok is false (:175). All 13 OPENs that night were true. The target list was empty."],cells:[{label:"What the log actually shows",paths:[],blocks:[`[2026-07-28T21:07:33…] wrote 235 open
 solicitations -> …/bids/all-bids.json
[2026-07-29T10:36:29…] beaconbid enrich_details:
 2/2 bids, 3 document(s)`],notes:["The proof in the snapshot. Of 235 rows in bids/all-bids.json, only 4 carry a contact name, only 4 carry a documents list, and only 2 carry page text. Those 4 rows are, exactly, the 4 YES bids. On this portal a contact is something a bid earns after it is judged, not something the judge gets to see.","Those are consecutive lines in logs/pull_log.txt. Nothing ran between the pull and the next morning. The two bids fetched on the 29th are exactly the two bids the judge scored YES that night; the run's other two YES were carried from earlier days. That is the signature of the board-side contact pass at stage 10, not of this stage."],tables:[]},{label:"Bid B, in all-bids.json as it stands today filled a day late",paths:[],blocks:[`{
 "bid_id": "24955ed3-377f-4209-a19d-45848c47a42e",
 "contact_name": "Chesca Jennings",
 "contact_email": "cjennings@sanpatriciocountytx.gov",
 "documents": [
 {
 "file_name": "A1._RFP2026-006_Debris Removal.pdf",
 "file_url": "",
 "file_path": "",
 "file_description": "Solicitation",
 "login_gated": true
 }
 ],
 "_docs_gated": "planholder registration (Get on
 Interest List)",
 "page_text": "RFP026-006 Disaster Debris Removal
 \\n\\nContact: Chesca Jennings
 cjennings@sanpatriciocountytx.gov
 \\nDocuments (planholder-gated):
 A1._RFP2026-006_Debris Removal.pdf…",
 "_detail_ok": true
}`],notes:["The document has a name and a description but no address and no bytes. That is the wall, recorded honestly rather than left blank."],tables:[]}],notes:[],then:"the judging set is assembled from the OPENs that have no verdict yet"},{n:"5",title:"Build the judging set",who:"ps.build_judge_input_open (open folders/_lib/platform_sweep.py:258-297)",summary:["Three groups are gathered: tonight's 5 new OPENs, any older OPEN that still has no verdict, and any bid the re-judge rule pulls back. Then the scope text is re-read from the snapshot so the judge sees whatever body we hold.","The 8 carryover OPENs already had verdicts from earlier days, so none of them came back. The set is exactly the 5 new OPENs."],cells:[{label:"In → Out",paths:[{path:"runs/triage-verdicts.json + runs/triage-carryover.json",size:"5 new OPEN + 8 carried OPEN"},{path:"daily/<newest>/verdicts.json",size:"who already has a verdict"},{path:"runs/judge-input-open.json",size:"5,281 bytes · 5 rows"}],blocks:[],notes:["This is the fix that stops a bid from being marked OPEN on one day and then sitting forever unjudged. It is why the judged count and the OPEN count are allowed to differ."],tables:[]},{label:"Real record Bid B: what the judge will read",paths:[],blocks:[`{
 "idx": 83,
 "bid_id": "24955ed3-377f-4209-a19d-45848c47a42e",
 "title": "RFP026-006 Disaster Debris Removal",
 "buyer": "San Patricio County",
 "state": "MULTI",
 "due_date": "2026-08-06",
 "detail_url": "https://www.beaconbid.com/
 solicitations/san-patricio-county/
 24955ed3-377f-4209-a19d-45848c47a42e",
 "description_full": "Title: RFP026-006 Disaster Debris
 Removal\\nBuyer: San Patricio County\\nState:
 MULTI\\nCloses: 2026-08-06\\nSource URL: …
 \\n\\nRFP body:\\nAttached is a copy of the
 Request for Proposals (“RFP”) for Disaster
 Debris Removal, Reduction Disposal, and
 Other Emergency Services to provide services
 to remove, process, and lawfully dispose of
 disaster-generated debris from public
 property and public rights-of-way.…"
}`],notes:["Two sentences. No contact, no document names, no page text, because stage 4 never ran. Same bid in judge-input.json says RFP body (truncated to 6KB); here it says RFP body:. Two spellings of the same header in two files written by the same sweep."],tables:[]}],notes:[],then:"five bids get scored"},{n:"6",title:"Pass 2: would LGS actually bid this?",who:"max-bid-judge · AI → runs/judge-verdicts.json",summary:["Yes, maybe or no, plus a score out of 100 and a one-line reason. Five bids in, five out: 2 YES, 3 NO, 0 MAYBE. The three NOs scored 25, 5 and 15.","Bid B scored 88 on two sentences of scope. The judge never had the contact, the document name or the page text, because stage 4 did not run."],cells:[{label:"Out",paths:[{path:"runs/judge-verdicts.json",size:"5,633 bytes · 5 rows"}],blocks:[`8b36e6f9 no 25
781f804d no 5
24955ed3 yes 88
8173cc9b yes 80
cadc832d no 15`],notes:["Both key spellings get filled. Agents have returned two shapes over time: verdict plus lgs_score, or would_lgs_bid plus score. The compile step writes both families onto every row so a strict reader downstream cannot silently drop a YES."],tables:[]},{label:"Real record Bid B: YES, 88",paths:[],blocks:[`{
 "bid_id": "24955ed3-377f-4209-a19d-45848c47a42e",
 "title": "RFP026-006 Disaster Debris Removal",
 "buyer": "San Patricio County",
 "due_date": "2026-08-06",
 "detail_url": "https://www.beaconbid.com/
 solicitations/san-patricio-county/…",
 "verdict": "yes",
 "would_lgs_bid": "yes",
 "lgs_score": 88,
 "score": 88,
 "primary_reason": "Explicit disaster debris REMOVAL,
 reduction, and lawful disposal from public
 property and rights-of-way - this is core DRC
 (removal) work squarely in LGS's storm/
 disaster response business.",
 "red_flags": []
}`],notes:[],tables:[]}],notes:[],then:"new and carried are merged into the day folder"},{n:"7",title:"Write the day folder",who:"ps.compile_archive (open folders/_lib/platform_sweep.py:353-485)",summary:["Carryover and new triage are merged, prior verdicts are merged with tonight's, both key spellings are filled in, and the dated folder is written. This folder is the memory the next run diffs against.","This is also where BeaconBid does its own carry-forward. A prior verdict is kept only if the bid is still in today's snapshot. That is stricter than the shared orchestrator script, which keeps a verdict for up to 90 days even after the bid falls out of the pull."],cells:[{label:"Out: data/beaconbid/daily/2026-07-28/",paths:[],blocks:[],notes:['"new-bids.json" holds all 235, not the 53 new ones. It is a copy of the snapshot under a misleading name. The count that actually means "new tonight" is new_to_triage in stats.json.'],tables:[[{header:!0,cells:["File","Holds","Size"]},{header:!1,cells:["triage.json","235 decisions, tomorrow's memory","46,298 B"]},{header:!1,cells:["verdicts.json","13 verdicts: 5 new, 8 carried","12,945 B"]},{header:!1,cells:["new-bids.json","235 rows, the whole snapshot","323,699 B"]},{header:!1,cells:["stats.json","the funnel counts","458 B"]},{header:!1,cells:["report.md","human summary","2,024 B"]}]]},{label:"Real record Bid B in daily/verdicts.json",paths:[],blocks:[`{
 "bid_id": "24955ed3-377f-4209-a19d-45848c47a42e",
 "title": "RFP026-006 Disaster Debris Removal",
 "buyer": "San Patricio County",
 "verdict": "yes",
 "would_lgs_bid": "yes",
 "lgs_score": 88,
 "score": 88,
 "red_flags": [],
 "bid_key": "beaconbid:24955ed3-377f-4209-a19d-
 45848c47a42e"
}`],notes:["bid_key appears here and nowhere earlier. The bid gets a fifth name on its way out."],tables:[]}],notes:["triage.json is five different shapes in one file. The 235 rows break down as 77 with {bid_id, decision, reason}, 73 with {bid_id, decision, idx, reason, title}, 40 with {bid_id, decision, reason, title}, 32 that also carry _triaged, and 13 with {bid_id, decision, idx, reason}. Every row that survives a carryover hop keeps whatever keys it had on the day it was decided. Only bid_id, decision and reason are safe to rely on."],then:"the portal's own work is done, and the shared machinery takes over"},{n:"8",title:"Carry forward: deliberately OFF for this portal",who:"2.5 · scripts/carry_forward_verdicts.py --all",summary:[`The shared safety net rescues verdicts for bids that dropped out of one night's pull. The --all run only touches portals whose registry says carry_forward: "orchestrator". BeaconBid says "engine-internal", so the script walks past it.`,"In plain words: BeaconBid already did this itself at stage 7. Running the shared script on it as well would apply carry-forward twice."],cells:[{label:"Where the 13 verdicts in tonight's folder actually came from",paths:[],blocks:[],notes:["An unexplained stamp. Two scripts write _first_judged, and each always drops its own audit file beside it: the shared carry-forward script (scripts/carry_forward_verdicts.py:135 and :187) writes _carryforward_audit.json (:216), and the one-shot recovery script (scripts/recover_orphaned_verdicts.py:82) writes _recovery_audit.json (:135). The folders daily/2026-06-09/ and daily/2026-06-23/ do have the carry-forward audit. The folders daily/2026-07-16/ and daily/2026-07-20/ have neither audit file, and no BeaconBid folder holds a recovery audit at all. Yet rows stamped with those exact dates are sitting in tonight's verdicts, including two of the four YES bids, and each of those two stamps first appears in the folder of its own date, which is the carry-forward script's = today stamp at :135. Either the audit file was deleted, or a sweep agent hand-wrote the field. This cannot be settled from the code. Note also that the carry-forward script's --portal <slug> switch skips the registry check entirely, so a hand-run would double-apply carry-forward here."],tables:[[{header:!0,cells:["Bid","Verdict","Score","_first_judged stamp"]},{header:!1,cells:["5 judged tonight, no stamp"]},{header:!1,cells:["24955ed3","yes","88","none"]},{header:!1,cells:["8173cc9b","yes","80","none"]},{header:!1,cells:["8b36e6f9","no","25","none"]},{header:!1,cells:["781f804d","no","5","none"]},{header:!1,cells:["cadc832d","no","15","none"]},{header:!1,cells:["8 carried from earlier days"]},{header:!1,cells:["3914e486","yes","72","2026-07-16"]},{header:!1,cells:["76f95c6d","yes","74","2026-07-16"]},{header:!1,cells:["b5a14592","no","5","2026-06-23"]},{header:!1,cells:["80293f93","no","12","2026-07-20"]},{header:!1,cells:["bd09bc20, 4e6e58d0, 591b9024, a65b2c45","no","12, 4, 4, 12","none"]}]]}],notes:[],then:"the day folder is read back by three shared jobs"},{n:"9",title:"Ledger, report rewrite, board fixtures",who:"2.6 portals_cumulative.py · 2.7 standardize_daily_reports.py · 2.8 dump_yes_for_portalpro.py + dump_activity_matrix.py",summary:["Three jobs read BeaconBid's dated folders. The first walks every verdicts.json the portal has ever written and keeps the yes and maybe rows in one master list. The second overwrites tonight's report.md with the shared operator layout. The third turns YES bids into board cards.",`Membership comes from the registry, not from a hand-kept list inside the script. The sweep skill's claim that BeaconBid is "registered in portals_cumulative.py" is stale prose.`],cells:[{label:"Out",paths:[{path:"data/portals/cumulative-yes.json + .md",size:"every still-open YES across all portals"},{path:"daily/2026-07-28/report.md",size:"rewritten · 2,024 bytes"},{path:"PortalPro/src/fixtures/portal-bids.json",size:"1,470 cards · 7 of them beaconbid"},{path:"PortalPro/src/fixtures/activity-matrix.json",size:null}],blocks:[],notes:["Two writers, one file, and the clock proves it. Stage 7 wrote report.md at 21:13 UTC. The footer of the file on disk reads _Standardized report · regenerated 2026-07-28T22:37:25+00:00_. The second writer wins, an hour and a half later."],tables:[]},{label:"The rewritten report on disk, with each bid's reasoning line and link left out",paths:[],blocks:[`# BeaconBid — 2026-07-28

**Source:** https://www.beaconbid.com/solicitations
· engine \`beaconbid\` · state MULTI

- Snapshot: **235** open bids
- Carryover: 182 · NEW today: 53
- Triage: 13 OPEN / 222 SKIP
- Scored: **4 YES / 0 MAYBE / 9 NO**

## YES — Max would bid

- **[88] RFP026-006 Disaster Debris Removal** —
 San Patricio County — closes 2026-08-06 …
- **[80] MOWING AND LANDSCAPING SERVICES FOR
 FLOOD CONTROL LEVEES** — City of Memphis …
- **[74] Non-Residential Grass Mowing** —
 City of Cumberland …
- **[72] Residential Grass Mowing** —
 City of Cumberland …

## MAYBE — operator judgment

_none_`],notes:["A MAYBE would never reach the board anyway. The fixture dump keeps maybe rows only for federal feeds, and BeaconBid is not one. There were 0 maybes that night, so nothing was lost this time."],tables:[]}],notes:[],then:"bids stop being BeaconBid's here"},{n:"10",title:"Onto the shared board, then go get the contact",who:"2.85 publish_to_supabase.py → clusters → llm_dedup → apply_llm_dedup.py · 2.85b run_enrichment_phase.py (enrich_beaconbid.py)",summary:["The YES cards are pushed into the shared database and then clustered with every other portal's bids, so the same solicitation seen on two portals collapses into one card. The run's counters are written too.","Straight after, the BeaconBid contact pass looks for live BeaconBid bids on the board that are yes or maybe and have no contact, re-opens just those detail pages, and patches the contact columns. This is the pass whose fingerprint we saw at stage 4: two bids, the morning after."],cells:[{label:"Tables touched",paths:[],blocks:[],notes:['The card is thinner than the file. The board card below says contact_name: null and has_documents: false. The snapshot on disk for that same bid holds Chesca Jennings, an email, and one document name. The day folder was frozen at 21:13 UTC on 28 July; the detail fetch did not land until 10:36 UTC on 29 July. The card is built from that dated archive folder, so it shows the bid as it was before the fetch. state and category come out blank as well. The only values the snapshot has to offer are the word "MULTI" and that cut-off Python dictionary from stage 1.'],tables:[[{header:!1,cells:["portals","upsert key + label"]},{header:!1,cells:["bids","upsert the YES rows"]},{header:!1,cells:["clusters + bids.cluster_id","cross-portal grouping"]},{header:!1,cells:["sweep_runs","tonight's raw / open / yes / maybe / no counters"]},{header:!1,cells:["bids (contact columns)","patched by the 2.85b pass, only where still empty"]}]]},{label:"Real card Bid B on the board",paths:[],blocks:[`{
 "id": "aed600acd3bddf93",
 "portal": "beaconbid",
 "portal_label": "BeaconBid",
 "source_bid_id": "24955ed3-377f-4209-a19d-
 45848c47a42e",
 "title": "RFP026-006 Disaster Debris Removal",
 "buyer": "San Patricio County",
 "state": "",
 "solicitation_no": "RFP026-006 Disaster Debris
 Removal",
 "federal": false,
 "score": 88,
 "verdict": "yes",
 "category": "",
 "due_date": "2026-08-06",
 "contact_name": null,
 "contact_email": null,
 "contact_phone": null,
 "red_flags": [],
 "fit_signals": [],
 "first_seen": "2026-07-28",
 "last_seen": "2026-07-28",
 "has_documents": false
}`],notes:["Three of the seven BeaconBid cards in the fixture do carry a contact name. All three are older bids, and the log records enrich_details runs on 2026-07-18 (2 bids, then 3 bids). So the pass works. It just does not finish in time for a bid judged the same night."],tables:[]}],notes:[],then:"now the shared machinery tries to read the paperwork"},{n:"11",title:"Documents, requirements, second dedup, bid packs",who:"2.87 extract_doc_text.py → requirements-extractor → apply_requirements.py · 2.875 dedup re-pass · 2.89 build_bidpack.py",summary:["These jobs work on clusters, not on portals. They try to pull the actual bid paperwork, read the requirements out of it with verbatim quotes, then run dedup a second time now that buyers and dates are better filled, and finally render each cluster into a folder an AI can read.","For BeaconBid this stage mostly runs on the page text, because the paperwork is walled."],cells:[{label:"The document wall, recorded as a reason instead of a blank",paths:[],blocks:[],notes:["Only 2 of 235 rows have page text. Because stage 4 almost never fires, most BeaconBid clusters arrive here with a list blurb and nothing else. The blurb is often good, because the site returns full scope inline, but there is no second, richer source behind it."],tables:[[{header:!1,cells:["Document names","public: they come back in the detail reply"]},{header:!1,cells:["Document bytes",'need a free "Get on Interest List" planholder signup, one per agency. An anonymous fetch fails.']},{header:!1,cells:["What we write instead",'a documents row with login_gated: true, empty file_url and file_path, plus _docs_gated: "planholder registration (Get on Interest List)"']},{header:!1,cells:["What the cluster gets",'a neutral no-material coverage row, so the board never shows "not extracted yet" for something that can never be extracted']},{header:!1,cells:["Bid pack","BID.md plus page text. No docs/ text, because there are no bytes."]}]]}],notes:[],then:"what changed, who gets told, did the run finish"},{n:"12",title:"Watch, mail, sentinel",who:"2.88 · watch_list_signals.py · publish_page_text.py · new_bids_email.py · bid_watch.py · pipeline_sentinel.py",summary:[`BeaconBid's registry watch mode is "none", so nothing re-captures its pages looking for changes. Its new YES clusters still appear in the discovery email, and the sentinel still checks that every phase actually ran for it.`],cells:[{label:null,paths:[],blocks:[],notes:[`Nothing looks at a BeaconBid bid twice. Watch is off, and stage 4 is near-dormant. Once a bid is judged, no job re-reads its page. If the buyer changes the closing date or posts an addendum, this pipeline will not see it. The portal's own runbook says watching can be turned on "if this portal posts addenda after listing". Nobody has checked whether it does.`],tables:[[{header:!1,cells:["Source re-capture / addenda watching",'off, per registry watch: "none"']},{header:!1,cells:["Discovery email of new YES clusters","BeaconBid is included"]},{header:!1,cells:["Deadline and change alerts","dead until RESEND_API_KEY is set in data/auth/resend.env"]},{header:!1,cells:["Sentinel",`writes data/portals/sentinel.json; the portal's own runbook recorded health "ok" on 2026-07-14`]}]]}],notes:[],then:"the boards and the one number anyone may quote"},{n:"13",title:"Boards, roll-up, scorecard",who:"2.9-2.95 build_portal_metrics.py · build_monitor_html.py · build_portals_overview.py · P3-P4.99 roll-up + scorecard.py",summary:["Every BeaconBid stats.json across all 33 dated folders is read back into the portal-by-day grid. Tonight's report.md is inlined into the all-portals overview page. Then the operator writes the roll-up and the scorecard asks the database for the YES count."],cells:[{label:"Out",paths:[{path:"data/portals/metrics.json · overlap.json · monitor.html · overview.html",size:null},{path:"data/portals/daily/2026-07-28/roll-up.md · data/portals/scorecard.csv",size:null}],blocks:[],notes:["Do not add up the per-portal numbers. Summing scoring.yes across portals is explicitly banned as a YES total, because the same solicitation can appear on several portals and the clustering at stage 10 is what collapses it. The only quotable YES number comes from scripts/scorecard.py reading the shared database. BeaconBid's own 4 is a per-portal count, nothing more."],tables:[]}],notes:[],then:null}],l=[{heading:"The quirks that bite: all on one card",tables:[[{header:!0,cells:["Quirk","Consequence"]},{header:!1,cells:['_detail_ok means "the list had a description", not "we visited the page" (open folders/_lib/engines/beaconbid.py:90), yet the detail fetch targets only OPENs where it is false (:175)',"Confirmed defect. All 13 OPENs on 28 July were true, so the detail visit never ran. The judge scored an 88 from four sentences. Only 4 of 235 rows on disk carry a contact, and they are exactly the 4 YES bids, filled later by the board-side pass."]},{header:!1,cells:["No floor guard on the pull",`If the page's own request is not captured in 40 seconds, an empty snapshot with "error": "no_query_captured" is written over a healthy 235-row file. Another portal's engine has this guard; this one does not.`]},{header:!1,cells:["Every bid's state is the word MULTI",`The engine only finds a state when the buyer's name literally contains ", XX". "San Patricio County" does not, so it falls back to the config default. All 235 rows are MULTI, and the board card's state is blank. Geography is unusable on this portal.`]},{header:!1,cells:["category is a Python dictionary printed into a string and cut at 60 characters",`"{'code': '84', 'name': 'General Construction (Buildings, Facilities, Offices Etc". No closing brace. Nothing can parse it; the board shows category empty.`]},{header:!1,cells:["triage.json holds five different key shapes across its 235 rows (77 / 73 / 40 / 32 / 13)","Rows keep whatever keys they had on the day they were decided. Only bid_id, decision and reason are safe to read."]},{header:!1,cells:["new-bids.json in the day folder holds all 235 bids, not the 53 new ones","Anyone reading the name instead of stats.json → new_to_triage overstates the night by more than four times."]},{header:!1,cells:["Document bytes are behind a free per-agency planholder signup; a bare data request is refused outright; custom questions are refused too","The three known walls. We keep document names and write the reason, replay the page's own request body, and never hand-write a query."]},{header:!1,cells:["_first_judged stamps dated 2026-07-16 and 2026-07-20 exist with no audit file in either folder","Open question. Two scripts write that field and each always writes its own audit file too (_carryforward_audit.json / _recovery_audit.json); neither file is in those folders. Two of tonight's four YES bids carry an unexplained stamp."]},{header:!1,cells:["Registry says enrich_passes: []; scripts/enrichers.py:83 registers a live pass","The registry field is stale. Runtime reads enrichers.py. Anyone auditing enrichment from the registry will conclude, wrongly, that nothing runs."]},{header:!1,cells:['The portals skill says "1 pull/day"; the registry says cadence_days: 3',"No code enforces a daily cap. Three days is the real number."]},{header:!1,cells:["The pull log said total 237 but collected 235","Two solicitations the site counted were never handed over, and page 5 came back empty. Nothing checks the collected count against the site's own total."]},{header:!1,cells:["data/beaconbid/PORTAL.md is an auto-generated 2026-07-14 draft",'Every field-map row is TODO, and it claims "enrich passes: none" and "document coverage 0%". It is not a usable runbook. This page and docs/portal-dataflow/beaconbid.md are the real ones.']}]],paragraphs:[]},{heading:"Where the model doc and the disk disagree",tables:[[{header:!0,cells:["The model says","The files say"]},{header:!1,cells:["Volume per run: 230 open solicitations (dated 2026-07-23)","235 on 2026-07-28. The model's headline number is one run stale."]},{header:!1,cells:["Stage P4a fetches the detail page for OPEN bids, between triage and the judge","It did not run on 28 July. The only detail fetch touching this run's bids happened at 10:36 UTC the next morning, on 2 bids, from the board-side pass at 2.85b."]},{header:!1,cells:["The engine derives a two-letter state per bid from the agency name","It tries, and fails for all 235 rows. Every one is MULTI."]},{header:!1,cells:["Registry enrich_passes: []","A pass is registered and demonstrably runs. The model doc already flags this as registry drift; the disk confirms the pass fires."]}]],paragraphs:["Generated 5 August 2026 by /portal-stages-visualise from the run of 28 July 2026. Every record above was read from the named file on disk; every count traces to data/beaconbid/daily/2026-07-28/stats.json, a row count, a byte size, or a line of data/beaconbid/logs/pull_log.txt. Baseline map: docs/portal-dataflow/beaconbid.md (evidence-cited to file:line). Long string values are shortened with a trailing … and never reworded. Companion pages: Portal pedia · 02 (DemandStar)."]}],h="Generated 5 August 2026 by /portal-stages-visualise from the run of 28 July 2026. Every record above was read from the named file on disk; every count traces to data/beaconbid/daily/2026-07-28/stats.json, a row count, a byte size, or a line of data/beaconbid/logs/pull_log.txt. Baseline map: docs/portal-dataflow/beaconbid.md (evidence-cited to file:line). Long string values are shortened with a trailing … and never reworded. Companion pages: Portal pedia · 02 (DemandStar).",c="docs/portal-dataflow/pedia-beaconbid.html",p={slug:e,title:t,eyebrow:a,headline:s,lede:n,funnel:o,funnel_note:r,legend:i,stages:d,sections:l,footer:h,source_page:c};export{p as default,a as eyebrow,h as footer,o as funnel,r as funnel_note,s as headline,n as lede,i as legend,l as sections,e as slug,c as source_page,d as stages,t as title};

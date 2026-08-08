const e="georgia-doas-gpr",t="Georgia GPR: what happens to a bid, stage by stage",s="Portal pedia · 21",a="Georgia GPR: what happens to a bid, from the state registry to the board",n="Every stage of the run of 28 July 2026, with a real record from the real file at each step. Three bids are followed. Two of them were decided on earlier nights and simply kept their answers, which is the whole point of this portal's design. The third is the only bid that got a fresh verdict that night.",o=[{value:"512",label:"pulled"},{value:"449",label:"kept old answer"},{value:"63",label:"new titles read"},{value:"4",label:"opened"},{value:"4",label:"judged"},{value:"1",label:"new yes"}],r="Top row: data/georgia-doas-gpr/runs/_funnel.json (156 bytes) plus the row counts of runs/triage-verdicts.json (63 rows, 59 SKIP / 4 OPEN) and runs/judge-verdicts.json (4 rows, 1 yes / 3 no). Bottom row: data/georgia-doas-gpr/daily/2026-07-28/stats.json (462 bytes) keys triage and scoring. Those two are the standing set for every bid still in the snapshot, carried from all earlier nights. Only one of the six YES bids was decided on 28 July. Adding scoring.yes up across portals or across nights counts the same bid many times.",i=["Bid A · PE-33213-NONST-2026-000000009 · Dekalb land bank, one address. SKIP.","Bid B · PE-66422-NONST-2027-000000011 · Roadside Tree Trimming, City of Auburn. YES, score 80.","Bid C · 48400-eRFQ-001851-2027 · GDOT drainage pipes, Fannin County. YES, score 68."],l=[{n:"0",title:"Is this portal due today?",who:"scripts/portal_due.py --batch portals",summary:["The gate looks at the dated folders under data/georgia-doas-gpr/daily/, finds the newest one, and compares it against the portal's cadence. Cadence here is one day, so the slug is printed almost every time and the sweep runs.","The newest folder before this run was 2026-07-24. That is four days earlier, not one."],cells:[{label:"In",paths:[{path:"data/georgia-doas-gpr/daily/<date>/",size:"36 dated folders on disk, first is 2026-06-03"},{path:"data/portals/registry.json",size:"the row below"},{path:"stdout",size:"one slug per line"}],blocks:[],notes:[],tables:[]},{label:"The registry row, as the inspector read it",paths:[],blocks:[`{
 "slug": "georgia-doas-gpr",
 "label": "Georgia GPR",
 "engine": "ga_doas_gpr",
 "batch": "portals",
 "cadence_days": 1,
 "authed": false,
 "enrich_passes": [],
 "watch": "none",
 "in_cumulative": true,
 "in_portalpro": true,
 "carry_forward": "engine-internal"
}`],notes:["Every one of these eleven fields decides something later on this page. carry_forward decides stage 8."],tables:[]}],notes:['Cadence one day does not mean a run every day. The folders on disk run 2026-07-15, 16, 20, 21, 23, 24, then 28. Thirty-six archives since 3 June. The gate only says "you may run"; something still has to dispatch it.'],then:"the slug is printed, so a child agent is started"},{n:"1",title:"The orchestrator hands the job to a child",who:"Agent(general-purpose) reading .claude/skills/georgia-doas-gpr-sweep/SKILL.md",summary:["Georgia GPR goes out in Batch B, five portals at once. The child agent gets a self-contained instruction: read the sweep runbook and run every phase of it.","This portal is not a heavy pull, so it is not held in the foreground. If the child fails, the other portals carry on and the roll-up marks this one failed."],cells:[{label:"In",paths:[{path:".claude/skills/georgia-doas-gpr-sweep/SKILL.md",size:"the runbook"},{path:"a running child agent",size:"no file is written"}],blocks:[],notes:[],tables:[]},{label:"The only proof on disk that the child ran",paths:[],blocks:[`data/georgia-doas-gpr/logs/pull_log.txt
[2026-07-28T19:03:01.779816+00:00] GPR pull starting ·
 base=https://ssl.doas.state.ga.us/gpr/ ·
 eventStatus=OPEN · today=2026-07-28`],notes:[`The model doc marks this stage's output "no code evidence" and that is right. An agent starting leaves no file. The timestamps in the logs are the trace.`],tables:[]}],notes:[],then:"one plain POST per page of fifty, no login, no browser"},{n:"2",title:"Pull the open list",who:"data/georgia-doas-gpr/scripts/run_daily.py → engines/ga_doas_gpr.py",summary:["The state's search grid is fed by a plain JSON endpoint. The pull grabs a cookie, then asks for the open events fifty at a time until it has as many as the server says exist. Eleven pages, seven seconds, no login and no browser.","The list carries no scope text. Title, buyer, agency code, dates, process type and a link. That is the whole record at this point."],cells:[{label:"In → Out",paths:[{path:"POST https://ssl.doas.state.ga.us/gpr/eventSearch",size:"eventStatus=OPEN"},{path:"bids/all-bids.json",size:"425,434 bytes · 512 rows"},{path:"bids/index.json",size:"284 bytes"},{path:"logs/pull_log.txt",size:"52,536 bytes"}],blocks:[`[2026-07-28T19:03:02.265623+00:00] GPR reports
 recordsTotal=512 OPEN events
[2026-07-28T19:03:02.287023+00:00] start= 0:
 50 rows, 50 new (total 50/512)
 … nine more pages …
[2026-07-28T19:03:09.816832+00:00] start= 500:
 12 rows, 12 new (total 512/512)
[2026-07-28T19:03:09.895389+00:00] wrote 512 open
 bids -> …\\data\\georgia-doas-gpr\\bids\\all-bids.json`],notes:["Exact match, 512 of 512, and not one WARNING line in the whole 52 KB log."],tables:[]},{label:"Real record Bid A",paths:[],blocks:[`{
 "bid_id": "PE-33213-NONST-2026-000000009",
 "title": "Addendum 2 - RFQ DRLBA-07082026-04
 3298 Blanton Drive",
 "buyer": "Dekalb Regional Land Bank Authority",
 "agency": "Dekalb Regional Land Bank
 Authority",
 "agency_code": "33213",
 "status": "Open",
 "due_date": "2026-07-28",
 "due_date_raw": "Jul 28, 2026 @ 05:00 PM",
 "posting_date": "2026-07-13",
 "process_type": "Non-State Agency",
 "government_type": "other",
 "ending_in": "Ending soon 1hrs,56 mins",
 "state": "GA",
 "detail_url": "https://ssl.doas.state.ga.us/gpr/
 eventDetails?eSourceNumber=PE-33213-NONST-
 2026-000000009&sourceSystemType=gpr20",
 "description": "",
 "_detail_ok": false
}`],notes:["Sixteen fields, empty description. _detail_ok: false here means the detail page was never asked for, not that a fetch failed. See stage 5."],tables:[]}],notes:["The one hard risk in this stage. If a page returns something that is not JSON, the paging loop stops instead of retrying, and the snapshot is quietly short. The only alarm is a WARNING line when the shortfall is bigger than one page of fifty (open folders/_lib/engines/ga_doas_gpr.py:298-301, :340-342). On this night nothing was short, so nothing was hidden."],then:"tonight's list is compared with the last archived night"},{n:"3",title:"Split new from already answered",who:"run_daily.py step 2 · ps.prep",summary:["The snapshot is matched against the newest archived triage.json, which was 24 July. A bid seen before keeps the answer it already has. Only a genuinely new bid is sent to an AI. This is the whole reason a 512-bid registry costs four AI calls a night.","A full judge record is also built for all 512 bids here, but its body is taken from the snapshot's description field, which is still empty for almost everything."],cells:[{label:"In → Out",paths:[{path:"bids/all-bids.json",size:"512 rows"},{path:"daily/2026-07-24/triage.json",size:"last night's answers"},{path:"runs/triage-input.json",size:"15,307 bytes · 63 rows"},{path:"runs/triage-carryover.json",size:"61,545 bytes · 449 rows"},{path:"runs/judge-input.json",size:"381,513 bytes · 512 rows"}],blocks:[`{
 "date": "2026-07-28",
 "snapshot_total": 512,
 "carryover_count": 449,
 "triage_input_count": 63,
 "prior_archive_ids_compared_against": 513
}`],notes:[],tables:[]},{label:"Real record Bid A in judge-input.json",paths:[],blocks:[`{
 "idx": 0,
 "bid_id": "PE-33213-NONST-2026-000000009",
 "title": "Addendum 2 - RFQ DRLBA-07082026-04
 3298 Blanton Drive",
 "buyer": "Dekalb Regional Land Bank Authority",
 "state": "GA",
 "due_date": "2026-07-28",
 "description_full": "Title: Addendum 2 - RFQ
 DRLBA-07082026-04 3298 Blanton Drive
 Buyer: Dekalb Regional Land Bank Authority
 State: GA
 Closes: 2026-07-28
 Source URL: https://ssl.doas.state.ga.us/…

 RFP body (truncated to 6KB):
 "
}`],notes:['The body is empty. This file is built before any detail page is fetched, so for almost every bid the "full" record is a header and nothing under it. Stage 5 rebuilds it for the few that matter.'],tables:[]}],notes:["63 arrived, 64 left. 513 bid ids were in the 24 July archive and 449 of them are still here, so 64 have closed or been pulled down. Their Pass-1 answers simply stop being carried. What that costs a bid that had a verdict is at stage 7."],then:"63 titles go to the first AI. Nothing else does."},{n:"4",title:"Pass 1: open it or drop it",who:"max-triage · AI, on runs/triage-input.json",summary:["The agent sees a title, a buyer, a state and a close date. Nothing else exists yet. The default answer is SKIP. Only a real Looks Great work verb, or a cryptic on-call or utility title, earns an OPEN.","Tonight: 59 SKIP, 4 OPEN out of 63. There is no keyword filter in front of this. Every new bid is read."],cells:[{label:"In → Out",paths:[{path:"runs/triage-input.json",size:"63 rows"},{path:"runs/triage-verdicts.json",size:"6,813 bytes · 63 rows"}],blocks:[`runs/triage-carryover.json
{
 "bid_id": "PE-33213-NONST-2026-000000009",
 "decision": "SKIP",
 "reason": "Land bank single-address scope."
}`],notes:["Bid A is one of the 449. An AI wrote that sentence on an earlier night. Tonight it was copied, not thought about, and it cost nothing."],tables:[]},{label:"Real record Bid C, opened tonight",paths:[],blocks:[`runs/triage-verdicts.json
{
 "bid_id": "48400-eRFQ-001851-2027",
 "decision": "OPEN",
 "reason": "GDOT drainage pipe work,
 culvert scope"
}`],notes:['Bid B was opened weeks ago. It sits in runs/triage-carryover.json tonight as {"decision": "OPEN", "reason": "roadside tree trimming, Tier A"}. Already opened and already judged means it skips the next two stages entirely.'],tables:[]}],notes:[],then:"only the four OPENs get their detail page fetched"},{n:"5",title:"Go get the real page, for four bids only",who:"ps.enrich_opens → ps.build_judge_input_open",summary:["Now the detail page is fetched, with plain requests, at most eight at a time (open folders/_lib/engines/ga_doas_gpr.py:251). It gives back the scope text, the buyer's name, email and phone, and the links to the attached files. All of it is written back onto the snapshot key by key, so nothing already captured is lost.","That merge holds across days, not just across two pulls in one night. Bid B already had its 1,052-character scope and its one PDF in the 23 July archive. It was not fetched tonight, and it still carries scope, contact and PDF in tonight's 512-row snapshot.","Then the judge's input is rebuilt from those now-filled rows. Four bids in, four bids out."],cells:[{label:"In → Out",paths:[{path:"runs/triage-verdicts.json",size:"the 4 OPENs"},{path:"https://ssl.doas.state.ga.us/gpr/eventDetails?…",size:"plain HTML, no login"},{path:"bids/all-bids.json",size:"rewritten with scope, contact, documents"},{path:"runs/judge-input-open.json",size:"9,955 bytes · 4 rows"}],blocks:[`[2026-07-28T19:09:31.902851+00:00] enrich_details:
 fetching 3 OPEN detail pages (requests)
[2026-07-28T19:09:36.023038+00:00] enrich_details:
 3/3 enriched, 2 documents, 3 with contact
[2026-07-28T19:14:37.098709+00:00] enrich_details:
 fetching 1 OPEN detail pages (requests)
[2026-07-28T19:14:39.568395+00:00] enrich_details:
 1/1 enriched, 4 documents, 1 with contact`],notes:["Two calls, three pages then one, four in total. All four came back. Six attached files between them."],tables:[]},{label:"Real record Bid C, after the fetch",paths:[],blocks:[`runs/judge-input-open.json
{
 "idx": 428,
 "bid_id": "48400-eRFQ-001851-2027",
 "title": "T32-D6-Drain Fannin SR60-4
 pipes-190905",
 "buyer": "Transportation, Department Of",
 "state": "GA",
 "due_date": "2026-08-24",
 "description_full": "… RFP body:
 Event Details Documents Respond to Event …
 48400-eRFQ-001851-2027 RFQ Open Agency
 Contract Services / Special Projects state
 2027 48400 TRANSPORTATION, DEPARTMENT OF
 Buyer Contact: Gari Aiken gaiken@dot.ga.gov
 +1 678-721-5245 --> Description This
 solicitation is being conducted by the
 Georgia Department of Transportation under
 its authority to procure services ancillary
 to the construction and maintenance of a
 public road …"
}`],notes:["2,566 characters where Bid A had none. Same field name, description_full, two very different things."],tables:[]}],notes:["This is the wall, and it is on purpose. Only bids that Pass 1 opened are ever fetched, so in tonight's 512-row snapshot exactly 20 rows have any description, 20 have a contact email, 16 have a documents list and 14 have page text. The other 492 carry _detail_ok: false and not one of them carries _detail_err, which is the proof that they were never fetched rather than fetched and failed. Any coverage number for this portal describes those 20 rows, not 512.","Nothing extra was re-opened tonight. The four ids in judge-input-open.json are exactly the four new OPENs. No carryover OPEN was sitting unjudged, and the newer re-judge-on-change trigger added nobody."],then:"four full pages go to the second AI"},{n:"6",title:"Pass 2: would Looks Great actually bid this?",who:"max-bid-judge · AI, on runs/judge-input-open.json",summary:["Yes, maybe or no, a score out of a hundred, a category, one paragraph of reasoning and a list of red flags.","Three of the four were rejected. Litter pickup for the City of Albany scored 22. Solid waste collection for Augusta scored 28. A bridge repair at Slate Mine Road scored 15, because the body is structural concrete work. One survived."],cells:[{label:"In → Out",paths:[{path:"runs/judge-input-open.json",size:"4 rows"},{path:"runs/judge-verdicts.json",size:"3,239 bytes · 4 rows"}],blocks:[],notes:['Read the red flags on Bid C. The judge did not stop at "does this look like our work". It found the eligibility catch in the body: only contractors already holding a Georgia DOT routine-maintenance agreement may answer. That is why a good-fit job scores 68 and not 85.'],tables:[]},{label:"Real record Bid C, YES 68",paths:[],blocks:[`{
 "bid_id": "48400-eRFQ-001851-2027",
 "title": "T32-D6-Drain Fannin SR60-4
 pipes-190905",
 "buyer": "Transportation, Department Of",
 "state": "GA",
 "would_lgs_bid": "yes",
 "score": 68,
 "category": "drainage",
 "primary_reason": "GDOT is seeking Drainage
 Rehabilitation, Repair, Replacement &
 Miscellaneous Maintenance Services on a
 state route (4 pipes, SR60, Fannin County) …",
 "red_flags": [
 "out_of_core_state",
 "prequalified_msa_holders_only",
 "single_county_or_corridor_lets_
 check_bundling",
 "requires_existing_gdot_routine_
 maintenance_prequalification"
 ]
}`],notes:["First flag, out_of_core_state, on a Georgia bid. The code says Georgia is a core state. See the quirks table."],tables:[]}],notes:[],then:"tonight's four answers are folded into the standing set"},{n:"7",title:"Write the night's folder",who:"ps.compile_archive",summary:["Carried Pass-1 answers plus tonight's new ones become one triage.json of 512 rows. Tonight's four verdicts are laid on top of the ones still standing from before, and that becomes verdicts.json. The whole snapshot is copied in as new-bids.json, and a report and an index row are written.","Both verdict shapes agents have used over the years are normalised here, at the moment of writing, so no downstream reader can silently lose a YES."],cells:[{label:"Out · data/georgia-doas-gpr/daily/2026-07-28/",paths:[],blocks:[`| date | snapshot | new | open | yes | maybe | no |
|---|---:|---:|---:|---:|---:|---:|
| 2026-07-28 | 512 | 63 | 31 | 6 | 4 | 21 |
| 2026-07-24 | 513 | 26 | 33 | 9 | 5 | 19 |`],notes:[],tables:[[{header:!0,cells:["File","Holds","Size"]},{header:!1,cells:["new-bids.json","512 rows, the whole snapshot","425,434 B"]},{header:!1,cells:["triage.json","512 decisions, tomorrow's memory","69,678 B"]},{header:!1,cells:["verdicts.json","31 standing verdicts","26,739 B"]},{header:!1,cells:["stats.json","the funnel counts","462 B"]},{header:!1,cells:["report.md","human summary","5,552 B"]}]]},{label:"Real record Bid C, as the archive keeps it",paths:[],blocks:[`daily/2026-07-28/verdicts.json
{
 "bid_id": "48400-eRFQ-001851-2027",
 "would_lgs_bid": "yes",
 "score": 68,
 "category": "drainage",
 "bid_key": "georgia-doas-gpr:48400-eRFQ-
 001851-2027",
 "verdict": "yes"
}`,`daily/2026-07-28/triage.json
{
 "bid_id": "PE-33213-NONST-2026-000000009",
 "decision": "SKIP",
 "reason": "Land bank single-address scope."
}`],notes:["Two new fields appear here that the AI never wrote: bid_key and verdict. That is the normalising step.","Bid A's journey ends here for the night. It was pulled, matched and copied. That is its whole cost."],tables:[]}],notes:["Thirty-three became thirty-one. Four verdicts were added tonight and six were dropped, because those six bids are no longer in the snapshot: PE-33213-NONST-2026-000000005, PE-33699-NONST-2026-000000125, PE-65600-NONST-2027-000000236, PE-77202-NONST-2026-000000020, PE-77544-NONST-2026-000000002, PE-77548-NONST-2026-000000389. Their verdicts are gone from this file for good. Four of those six are still visible on the board, because the cumulative ledger and the board fixture keep their own copy."],then:"the portal's own night is over. The shared machinery starts."},{n:"8",title:"Carry forward: this portal is not in it, on purpose",who:"2.5 · scripts/carry_forward_verdicts.py --all",summary:[`Across the system there is a safety net that re-attaches yesterday's verdicts to today's bids. It only runs on portals whose registry entry says carry_forward: "orchestrator". This one says "engine-internal", so it is filtered out and nothing is written for it.`,"Being out of that pass is not a gap. This sweep carries forward by itself, in two places you already saw: Pass-1 answers at stage 3, Pass-2 verdicts at stage 7. Running the orchestrator script here as well would apply the same merge twice."],cells:[{label:"This is why Bid A and Bid B cost nothing tonight",paths:[],blocks:[],notes:["An old fingerprint is still on the file. 15 of the 31 rows in tonight's verdicts.json carry a _first_judged field. The only script in the daily pipeline that writes that field is carry_forward_verdicts.py:134-135, the one that must not run on this portal. Older archives also carry _carryforward_from, which only the same script writes. So it was pointed at this portal at least twice in the past, and the stamps have ridden forward through every merge since. Harmless to the numbers, but the archive is not a clean record of which mechanism carried what."],tables:[[{header:!0,cells:["Bid","Where its answer came from on 28 July","AI calls"]},{header:!1,cells:["Bid A · SKIP","copied from runs/triage-carryover.json, written on an earlier night","0"]},{header:!1,cells:["Bid B · YES 80","Pass 1 copied from carryover, verdict copied from daily/2026-07-24/verdicts.json","0"]},{header:!1,cells:["Bid C · YES 68","read fresh by both agents tonight","2"]}]]}],notes:[],then:"the ledger, the report and the board fixture are rebuilt"},{n:"9",title:"Ledger, report, board fixture",who:"2.6 portals_cumulative.py · 2.7 standardize_daily_reports.py · 2.8 dump_yes_for_portalpro.py",summary:["Three cross-portal scripts read what this sweep just wrote. The ledger walks all 36 archived days and keeps every YES ever recorded, live or closed. The report writer overwrites the report the sweep made, using one layout every portal shares. The fixture dump turns YES verdicts into board cards."],cells:[{label:"Two writers, one file, and you can see which won",paths:[{path:"data/portals/cumulative-yes.json + .md",size:null},{path:"daily/2026-07-28/report.md",size:"5,552 bytes"},{path:"PortalPro/src/fixtures/portal-bids.json",size:"1,470 cards, 24 from this portal"}],blocks:[`daily/2026-07-28/stats.json
 "generated_at": "2026-07-28T19:16:07.568225+00:00"

daily/2026-07-28/report.md, last line
 _Standardized report · regenerated
 2026-07-28T22:37:27+00:00_`],notes:["The sweep wrote the report at 19:16. The shared writer rewrote it three hours later. The second one is the one a human reads."],tables:[]},{label:"What the report says at the top, verbatim",paths:[],blocks:[`- Snapshot: **512** open bids
- Carryover: 449 · NEW today: 63
- Triage: 31 OPEN / 481 SKIP
- Scored: **6 YES / 4 MAYBE / 21 NO**`],notes:['The four MAYBEs never leave this folder. The fixture dump surfaces YES only for this portal, so a stormwater job at Douglasville and three others scored 43 to 50 sit in the archive and never appear on the board. All 24 board cards for this portal have verdict "yes" (dump_yes_for_portalpro.py:131-137).'],tables:[]}],notes:[],then:"the bid stops being a Georgia bid and becomes a shared one"},{n:"10",title:"Onto the shared board, and into a cluster",who:"2.85 · publish_to_supabase.py → llm_dedup_candidates.py → apply_llm_dedup.py",summary:[`The cards are pushed into the shared bid table, then grouped into clusters with every other portal's bids, so one solicitation seen here and on BidNet or a Bonfire tenant becomes one row for a human. An AI confirms the pairs that look like the same job. There is no "new today" gate any more — it came out of the code at 17:49 UTC on 28 July, about an hour before this run started, so this night already ran without it. A pair is now offered unless a ruling on it still stands, and how fresh a cluster is only sets the queue order, with at most 120 pairs sent to the judge a night (scripts/llm_dedup_candidates.py:37, :238-242, :301-309).`],cells:[{label:"In → Out",paths:[{path:"PortalPro/src/fixtures/portal-bids.json",size:null},{path:"supabase: bids, clusters, sweep_runs, portals",size:null},{path:"data/portals/llm-dedup-candidates.json",size:null}],blocks:[],notes:['One flag worth knowing. The card below says has_documents: false, yet the snapshot for the same bid names one attached PDF. They are not the same question. dump_yes_for_portalpro.py:420 sets that flag from rows in the shared bid_documents table, matched by cluster. It answers "is the file already in the shared store", not "did the portal list a file".'],tables:[]},{label:"Real card Bid B on the board",paths:[],blocks:[`{
 "id": "22a8f9f495fcb70f",
 "portal": "georgia-doas-gpr",
 "source_bid_id": "PE-66422-NONST-2027-
 000000011",
 "title": "RFP 26-004 Roadside Tree Trimming",
 "buyer": "Auburn, City Of",
 "state": "GA",
 "score": 80,
 "verdict": "yes",
 "category": "municipal roadside tree trimming
 (Category 4)",
 "due_date": "2026-08-20",
 "contact_name": "Sunshine Palmer",
 "contact_email": "spalmer@cityofauburn-ga.org",
 "contact_phone": "770-963-4002",
 "red_flags": [
 "thin_description_pull_rfp_packet",
 "low_scale_inferred_small_city",
 "out_of_core_state"
 ],
 "fit_signals": [],
 "first_seen": "2026-07-23",
 "last_seen": "2026-07-28",
 "has_documents": false
}`],notes:["The verdict in the archive lists four fit_signals. The card lists none. They are dropped somewhere on the way to the fixture."],tables:[]}],notes:[],then:"the shared side goes and fetches the files"},{n:"11",title:"Documents and requirements",who:"2.86 publish_bid_documents.py + publish_page_text.py · 2.87 extract_doc_text.py → requirements",summary:["This portal has no enrichment pass of its own. Its registry entry says enrich_passes: [], and that is correct, because the capture already happened inside the sweep at stage 5. Two shared passes pick it up: one downloads the file links the sweep recorded and files them under the bid's cluster, the other pushes the captured page text into the shared table.","Then the text is pulled out of those files and an agent reads it to write the bid's requirements, with quotes. Requirements belong to the cluster, not to the portal."],cells:[{label:"In → Out",paths:[{path:"bids/all-bids.json",size:"only the 16 rows that have a documents list"},{path:"https://ssl.doas.state.ga.us/gpr/downloadAttachment?…",size:"public, no login"},{path:"supabase-storage: bid-docs/{cluster_id}/documents/…",size:null},{path:"supabase: bid_documents, bid_page_text, bid_requirements",size:null}],blocks:[],notes:["Both passes run after publishing and key on the cluster. A bid that never reached the board gets neither its files nor its page text. And since only opened bids were ever fetched, these passes only ever see 16 document lists and 14 page texts out of 512 rows."],tables:[]},{label:"Real record Bid B's file list",paths:[],blocks:[`bids/all-bids.json → documents
[
 {
 "file_name": "RFP26_004 Roadside Tree Trimming
 Services_ RF.pdf",
 "file_url": "https://ssl.doas.state.ga.us/gpr/
 downloadAttachment?attachmentId=51250125
 &sourceSystemType=gpr20",
 "file_description": ""
 }
]`],notes:["No paywall and no login on this endpoint. Where a bid has no file here, it is usually because the buyer attached none, not because we were blocked."],tables:[]}],notes:[],then:"now that blank fields are filled, look for duplicates again"},{n:"12",title:"Second look for duplicates",who:"2.875 · llm_dedup_candidates.py → bid-dedup-judge → apply_llm_dedup.py",summary:["Enrichment just filled in buyers and close dates that were blank an hour earlier. Pairs that could not be compared before can be compared now, so the duplicate check runs a second time on that leftover only.","If it finds no pairs, it stops. It must not be re-run against an old merges file."],cells:[{label:"In → Out",paths:[{path:"supabase: clusters + dedup_adjudications",size:null},{path:"data/portals/llm-dedup-candidates.json",size:"{pairs, cluster_count}"},{path:"data/portals/llm-dedup-merges.json",size:'the model doc marks this one "no code evidence"'}],blocks:[],notes:[],tables:[]}],notes:[],then:"what changed since last night, and did every phase run"},{n:"13",title:"Change signals, email, and the backstop",who:"2.88 · watch_list_signals.py · bid_watch.py · new_bids_email.py · pipeline_sentinel.py",summary:["Tonight's snapshot is compared against the last archived one for free change markers, the operator digests are built, and a sentinel checks that every phase of every portal actually happened."],cells:[{label:null,paths:[],blocks:[],notes:['An oddity worth naming. Bid A is PE-33213-NONST-2026-000000009, titled "Addendum 2 - RFQ DRLBA-07082026-04 3298 Blanton Drive". The original is a separate event in the same snapshot, PE-33213-NONST-2026-000000008, titled "RFQ No. DRLBA-07082026-04 Demolition and Site Restoration Services 3298 Blanton Drive, Scottdale". The portal posts addenda as brand new events with their own ids. That is why the addendum watcher has nothing to detect, and why one job can occupy several rows.'],tables:[[{header:!1,cells:["Close-date change and status change","work here. The snapshot carries due_date and status for all 512 rows"]},{header:!1,cells:["Addendum posted","cannot fire. This portal's status values are only Open or closed, and it publishes no addendum counter"]},{header:!1,cells:["Watch v2 detail re-capture",'not wired. Registry says watch: "none"']},{header:!1,cells:["Discovery and watch emails","silently do nothing until RESEND_API_KEY is set in data/auth/resend.env"]},{header:!1,cells:["Sentinel","writes data/portals/sentinel.json and exits 1 if any portal is red"]}]]}],notes:[],then:"and finally, where a human sees it"},{n:"14",title:"Packs, boards, and the numbers that get reported",who:"2.89 build_bidpack.py · 2.9-2.96 monitor + overview · 3-4.99 roll-up + scorecard.py",summary:["Every keyed cluster is rendered into a folder of plain markdown: a summary, the page text, the requirements and the full text of the files. A Georgia bid shows up in there as page-georgia-doas-gpr.md. Two self-contained HTML boards are rebuilt from every portal's stats.json, the orchestrator writes one row for this portal in the day's roll-up, and the scorecard queries the shared database for the only YES numbers anyone quotes.","The end is not the database. The end is the board at shessi.dev/lgs, the morning email, and the bid pack a human opens."],cells:[{label:"Out",paths:[{path:"data/bidpacks/{pack_key}/ + packs-index.json",size:null},{path:"data/portals/metrics.json · monitor.html · overview.html",size:null},{path:"data/portals/daily/2026-07-28/roll-up.md · data/portals/scorecard.csv",size:null}],blocks:[],notes:["The counting rule. Never add up scoring.yes across portals or across nights. For this portal it is the standing live set: six tonight, nine on 24 July, eleven on 23 July, and mostly the same bids each time. The scorecard is the one canonical count."],tables:[]}],notes:[],then:null}],d=[{heading:"The quirks that bite",tables:[[{header:!0,cells:["Quirk","What it costs you"]},{header:!1,cells:["Only bids that Pass 1 opened ever get their detail page fetched","20 of 512 rows have a description, 20 a contact, 16 a document list, 14 page text. Every coverage number for this portal describes those 20 rows. The other 492 carry _detail_ok: false with no _detail_err, meaning never fetched, not failed."]},{header:!1,cells:["verdicts.json is the standing live set, not the night's work","6 YES on 28 July, but only one of them was decided that night. Summing scoring.yes across portals or nights counts the same bid repeatedly."]},{header:!1,cells:["A bid that drops out of the snapshot loses its verdict at compile","Six verdicts vanished from verdicts.json between 24 and 28 July. Only the cumulative ledger and the board fixture keep them."]},{header:!1,cells:["Every Georgia YES is flagged out_of_core_state","The sweep runbook tells the judge to flag it; the code's core-state list includes GA (scripts/build_merged_portals.py:26, and two more scripts agree). 16 of the 31 verdict rows carry the flag for a reason the code does not support. One of the two is wrong and the runbook is winning."]},{header:!1,cells:["_first_judged on 15 of 31 rows","In the daily pipeline only carry_forward_verdicts.py writes that field, and it must not run on an engine-internal portal. (The one-shot recover_orphaned_verdicts.py also stamps it, but it is a manual, dry-run-by-default tool.) It was pointed at this portal at least twice in the past and the stamps ride forward. The archive is not a clean record of which mechanism carried what."]},{header:!1,cells:["MAYBE never reaches the board","The fixture dump surfaces YES only for non-federal portals. The four MAYBEs of 28 July stay in the local archive and no human ever sees them."]},{header:!1,cells:["has_documents: false on a card whose bid has a PDF","That flag is read from the shared bid_documents table by cluster (dump_yes_for_portalpro.py:420), not from the snapshot. Bid B names one PDF on disk and still shows false. Also, the four fit_signals in its verdict arrive at the card as an empty list."]},{header:!1,cells:["The pull loop stops on the first bad page instead of retrying","A blip halfway through paging gives a short snapshot that looks complete. The only alarm is a WARNING when the shortfall is over one page of fifty. This night was clean: 512 of 512, zero warnings."]},{header:!1,cells:["Addenda are posted as new events, not as updates",'The addendum watcher can never fire here, and the same job appears several times in one snapshot under different ids. Bid A is literally titled "Addendum 2".']},{header:!1,cells:["A full legacy copy of this portal still sits at open folders/platforms/georgia-doas-gpr/","Its own config, pull script, bids and archives. Nothing in the live flow reads it, but data/georgia-doas-gpr/PORTAL.md:34 still lists that pull script as live code. Somebody will edit the wrong file."]},{header:!1,cells:["PORTAL.md is still the auto-generated draft","Pull recipe, detail recipe, field map and documents section are all TODO, and its health snapshot is dated 2026-07-14. Run /portal-audit georgia-doas-gpr to close it."]},{header:!1,cells:["Cadence says one day, the folders say otherwise","36 archives since 3 June, with gaps: 21st, 23rd, 24th, then the 28th. A missing night is not visible in any single day's numbers, only in the folder list."]}]],paragraphs:["Generated 5 August 2026 by /portal-stages-visualise from the run of 28 July 2026. Every record above was read off disk from the file named beside it. Every count comes from stats.json, _funnel.json, a row count or a byte size in docs/portal-dataflow/pedia-inspect/georgia-doas-gpr.json. Where the stage model at docs/portal-dataflow/georgia-doas-gpr.md disagrees with the files, the files were used and the difference is stated on this page. Companion pages: Portal pedia · 01 (BidNet), Portal pedia · 02 (DemandStar)."]}],h="Generated 5 August 2026 by /portal-stages-visualise from the run of 28 July 2026. Every record above was read off disk from the file named beside it. Every count comes from stats.json, _funnel.json, a row count or a byte size in docs/portal-dataflow/pedia-inspect/georgia-doas-gpr.json. Where the stage model at docs/portal-dataflow/georgia-doas-gpr.md disagrees with the files, the files were used and the difference is stated on this page. Companion pages: Portal pedia · 01 (BidNet), Portal pedia · 02 (DemandStar).",c="docs/portal-dataflow/pedia-georgia-doas-gpr.html",p={slug:e,title:t,eyebrow:s,headline:a,lede:n,funnel:o,funnel_note:r,legend:i,stages:l,sections:d,footer:h,source_page:c};export{p as default,s as eyebrow,h as footer,o as funnel,r as funnel_note,a as headline,n as lede,i as legend,d as sections,e as slug,c as source_page,l as stages,t as title};

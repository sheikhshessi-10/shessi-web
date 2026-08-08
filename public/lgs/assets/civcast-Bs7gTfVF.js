const e="civcast",t="CivCast USA — what happens to a bid, stage by stage",a="Portal pedia · 13",s="CivCast USA: what happens to a bid, from plan room to board",n="Every stage of one run, with a real record from the actual files at each step. All data is from the run of 24 July 2026. The headline that night: CivCast handed us 279 open bids, only 24 were new, and 23 of those 24 were pipe, paving or water-plant work thrown out on the title alone. Exactly one new bid reached the judge, and it came back NO. The YES sitting on the board that day had been decided four days earlier and was carried forward inside the sweep.",o=[{value:"279",label:"in snapshot"},{value:"255",label:"carried over"},{value:"24",label:"new tonight"},{value:"29",label:"triage says open"},{value:"3",label:"yes"},{value:"4",label:"maybe"},{value:"22",label:"no"}],r="Sources: data/civcast/daily/2026-07-24/stats.json (468 bytes) and data/civcast/runs/_funnel.json (156 bytes). The other 250 rows were SKIPped and cost one title read each. Read the yes / maybe / no row carefully: it is the whole live verdict file (29 rows), not that night's new judging. Only one bid was judged fresh on 24 July, and that one is the NO at score 10.",i=["Bid A · 6a455ae3be5557ba073b204f — Ashland Phase 2 Detention & Mass Grading, Brazoria County TX. SKIP.","Bid B · 6a4bf9ae8d977eed8829222f — Disaster and/or Storm Recovery Services, West Lake Hills TX. YES, score 92.","Bid C · 69617000cb97ed358a6335a8 — WHCRWA Contract 52. The only bid this run judged. NO, score 10."],l=[{n:"0",title:"Is it due, and who runs it",who:"scripts/portal_due.py → Agent(general-purpose)",summary:["The gate asks one question: does data/civcast/daily/ already have a folder for today? Cadence is one day, so any day it does not, the slug prints as due. Then the orchestrator hands the whole sweep to one child agent, which reads the portal's own skill file and runs it end to end.","CivCast is a public plan room. No login, no browser, no cookie anywhere in this run."],cells:[{label:"In",paths:[{path:"data/portals/registry.json",size:"cadence + batch"},{path:"supabase.portals",size:"cadence_days, read first, registry is the fallback"},{path:".claude/skills/civcast-sweep/SKILL.md",size:"what the child agent follows"}],blocks:[],notes:[],tables:[]},{label:"The registry row this portal actually has",paths:[],blocks:[`{
 "slug": "civcast",
 "label": "CivCast USA",
 "engine": "civcast",
 "batch": "portals",
 "cadence_days": 1,
 "authed": false,
 "enrich_passes": [],
 "watch": "none",
 "in_cumulative": true,
 "in_portalpro": true,
 "carry_forward": "engine-internal"
}`],notes:["Two of these decide later stages. carry_forward: engine-internal keeps the portal out of the shared safety net at stage 8. enrich_passes: [] means no CivCast-specific enricher exists at stage 10."],tables:[]}],notes:[],then:"one child agent now owns the whole night"},{n:"1",title:"Pull the open list",who:"data/civcast/scripts/run_daily.py → open folders/_lib/engines/civcast.py",summary:["It POSTs the site's own filter one page at a time until the pages run out, maps each row to our bid shape, drops anything already past its bid date, and de-duplicates by project id. 14 pages that night. The site reported a total of 632; we kept 279 open ones.","What the list never sends: an owner or a scope. buyer, agency and description are written empty for all 279 rows. They only get filled at stage 4, and only for the bids triage opened."],cells:[{label:"In → Out",paths:[{path:"POST https://lambda.civcast.com/projects/getallprojects",size:"public JSON, no key"},{path:"data/civcast/bids/all-bids.json",size:"286,328 bytes · 279 rows"},{path:"data/civcast/bids/index.json",size:"318 bytes"}],blocks:[`{
 "generated_at": "2026-07-24T14:20:15.779720+00:00",
 "snapshot_total": 279,
 "source": "civcast",
 "engine": "civcast",
 "endpoint": "https://lambda.civcast.com/
 projects/getallprojects",
 "time_info": 0,
 "list_total_current": 632,
 "pages_scanned": 14,
 "tba_in_open": 24,
 "open_total": 279
}`],notes:[],tables:[]},{label:"Real record Bid A",paths:[],blocks:[`{
 "bid_id": "6a455ae3be5557ba073b204f",
 "project_id": "6a455ae3be5557ba073b204f",
 "title": "Ashland Phase 2 Detention &
 Mass Grading",
 "buyer": "",
 "agency": "",
 "status": "Open",
 "internal_id": "16759-0034-01",
 "due_date": "2026-07-24",
 "due_date_raw": null,
 "posting_date": null,
 "county": "Brazoria",
 "state": "TX",
 "is_tba": false,
 "detail_url": "https://www.civcastusa.com/
 project/6a455ae3be5557ba073b204f/summary",
 "description": "",
 "_detail_ok": false
}`],notes:['16 fields, no owner, no scope. The whole snapshot skews Texas: 269 TX, 6 OK, 4 LA. 24 of the 279 are TBA rows, kept on purpose — the engine warns not to "fix" a filter that is not broken.'],tables:[]}],notes:["632 minus 279 is fully explained — by the log, not by the data files. That night's line reads dropped 353 row(s) past bid date, and 632 − 353 = 279 exactly. It sits in data/civcast/logs/pull_log.txt; index.json never stores the drop count. The hole that used to hide a short pull is closed. On 24 July a page the loop could not read was logged, slept one second and skipped, and the run still exited clean — about 50 rows could vanish that way. Since 29 July an unreadable page raises, so no snapshot is written, and a walk that reads fewer rows than the list's own Total raises too. The 24 July log shows a clean walk of 13 full pages plus one empty one, so nothing was lost that night."],then:"today's ids are compared against yesterday's archive"},{n:"2",title:"Diff, then build the two inputs",who:"open folders/_lib/platform_sweep.py · prep()",summary:["Every project id in today's snapshot is looked up in the most recent day folder's triage.json. Seen before, it keeps its old OPEN or SKIP answer for free. Never seen, it goes to the triage agent. That is how 279 bids become 24 questions.","It compared against 268 ids from the 23 July archive. 255 matched and were carried; 24 were new."],cells:[{label:"In → Out",paths:[{path:"data/civcast/bids/all-bids.json",size:"279 rows"},{path:"data/civcast/daily/2026-07-23/triage.json",size:"268 prior ids"},{path:"runs/triage-input.json",size:"5,137 bytes · 24 rows"},{path:"runs/triage-carryover.json",size:"39,476 bytes · 255 rows"},{path:"runs/judge-input.json",size:"195,720 bytes · 279 rows"},{path:"runs/_funnel.json",size:"156 bytes"}],blocks:[`{
 "date": "2026-07-24",
 "snapshot_total": 279,
 "carryover_count": 255,
 "triage_input_count": 24,
 "prior_archive_ids_compared_against": 268
}`],notes:[],tables:[]},{label:"Real record — Bid A is not asked again triage-carryover.json",paths:[],blocks:[`{
 "bid_id": "6a455ae3be5557ba073b204f",
 "decision": "SKIP",
 "reason": "detention and mass grading,
 civil construction"
}`,`{
 "idx": 223,
 "bid_id": "69617000cb97ed358a6335a8",
 "title": "WHCRWA Contract 52",
 "buyer": "",
 "state": "TX",
 "due_date": "2026-08-18"
}`],notes:["Six fields, and the buyer is blank on all 24 — it is blank in the snapshot at this point. The triage agent gets a title, a state and a date. Nothing else exists yet."],tables:[]}],notes:["prep also wipes three answer files before it starts. triage-verdicts.json, judge-verdicts.json and judge-input-open.json are blanked to [] at platform_sweep.py:98, so a file with rows in it means this run wrote them. The code comment dates that fix to 28 July 2026 — four days after this run. It is why all three sit at 2 bytes on disk today while the day folder holds the full answers. The day folder is the durable store; runs/ is scratch."],then:"24 titles go to the AI"},{n:"3",title:"Triage — open it or drop it",who:"max-triage · AI on runs/triage-input.json",summary:["An agent reads each new title and answers OPEN or SKIP with a short reason. Default is SKIP. On 24 July it answered 23 SKIP and 1 OPEN. The 24 new titles were subdivision paving, water and sewer facilities, lift-station rehab, a sealcoat project and a blower purchase — a civil-construction board doing exactly what it does.","Merged with the 255 carried decisions, the day ends at 29 OPEN and 250 SKIP across 279 rows. That roughly 10% open rate is high for this system."],cells:[{label:"Out",paths:[{path:"runs/triage-verdicts.json",size:"2 bytes · empty today, see stage 2"},{path:"data/civcast/daily/2026-07-24/triage.json",size:"43,049 bytes · 279 rows · the durable answer"}],blocks:[`{
 "idx": 223,
 "bid_id": "69617000cb97ed358a6335a8",
 "decision": "OPEN",
 "reason": "cryptic title, water authority
 buyer (Tier D)"
}`],notes:["Note what the agent did there. The buyer field was blank, so it read the buyer out of the initials in the title and opened the bid because it could not tell what the job was."],tables:[]},{label:"Two of the 23 SKIPs real rows",paths:[],blocks:[`{
 "idx": 73,
 "bid_id": "6a626c90abb4f56b6c31eaee",
 "decision": "SKIP",
 "reason": "water/sewer/paving construction,
 wrong vertical"
}`,`{
 "idx": 143,
 "bid_id": "6a5e926a770d654d9d501696",
 "decision": "SKIP",
 "reason": "water plant construction"
}`],notes:["Bid A's journey ends here, and ended here on 5 July. Since then it has cost nothing but a copy from one day folder to the next."],tables:[]}],notes:[`This is the portal's weak spot, and the guard is only words. Triage once dismissed two Gulf Coast Water Authority canal mowing contracts as "grass mowing, not LGS"; both were later judged YES at 72 and both sit on the board today. The answer written into the sweep skill is a recall guardrail: force OPEN on any title containing mow, mowing, vegetation, ROW, right-of-way, clearing, brush, tree, debris, dredge, spray or herbicide, and let the judge decide. No script enforces it. There is no keyword list and no post-check anywhere in the code. It holds only as long as the agent reads and obeys the skill file.`],then:"only the 29 OPENs get a second HTTP call"},{n:"4",title:"Fetch the detail for the OPENs",who:"ps.enrich_opens → engines/civcast.py · getpublicproject",summary:["One GET per open project, 0.3 seconds apart. This is where a bid finally gets an owner, a real scope, a named person, and the list of its files. The snapshot is updated in place.","Counted on the day folder: 29 of 279 rows came back with _detail_ok: true — exactly the OPENs. 24 got a buyer, 28 got a contact email, 28 got a document list, 29 got page text. The other 250 rows keep their blank buyer forever."],cells:[{label:"In → Out",paths:[{path:"GET https://lambda.civcast.com/projects/getpublicproject?projectId=…",size:"once per OPEN"},{path:"data/civcast/bids/all-bids.json",size:"rewritten in place, 286,328 bytes"}],blocks:[],notes:["The document wall shows up right here. All 28 rows that carry a documents list also carry _docs_auth_walled: true. We get file names and a best-effort download URL; the bytes behind that URL need a free CivCast account token we do not send. Nothing downstream reads that flag.","Seven new keys appear on an enriched row and on no other row: contact_name, contact_email, contact_phone, contact_company, documents, _docs_auth_walled, page_text. That is why the snapshot's shape is ragged — an operator looking at a SKIPped row sees blanks that are not gaps in the source, just detail we never fetched."],tables:[]},{label:"Real record Bid B — enriched",paths:[],blocks:[`{
 "bid_id": "6a4bf9ae8d977eed8829222f",
 "title": "Disaster and/or Storm Recovery
 Services",
 "buyer": "West Lake Hills, Texas",
 "agency": "West Lake Hills, Texas",
 "internal_id": "2026-007",
 "due_date": "2026-08-20",
 "county": "Travis",
 "state": "TX",
 "description": "Under this contract, work shall
 consist of clearing and removing any and all
 &ldquo;eligible&rdquo; debris on an AS NEEDED
 basis, as defined by Federal Emergency
 Management Agency (FEMA) Publication 325…",
 "_detail_ok": true,
 "contact_name": "Evan Groeschel",
 "contact_email": "egroeschel@westlakehills.gov",
 "contact_phone": "(512) 327-3628",
 "contact_company": "City of West Lake Hill",
 "documents": [
 {"file_name": "Invitation to Bid",
 "file_url": "https://api.civcastusa.com/api/
 FileStorage/DownloadFileFromProject/…"},
 {"file_name": "Disaster Recovery Services
 Agreement Terms and Conditions", …},
 {"file_name": "Disaster Storm Recovery Request
 for Proposals", …}
 ],
 "_docs_auth_walled": true,
 "page_text": "Disaster and/or Storm Recovery
 Services\\n\\nOwner: West Lake Hills, Texas
 \\nContact: Evan Groeschel…"
}`],notes:["Look at the description: &ldquo; is stored as literal text, never turned back into a quote mark. That raw text is what the judge reads and what lands on the board."],tables:[]}],notes:[],then:"the judge's questions are rebuilt from the now-filled snapshot"},{n:"5",title:"Pick who still needs a verdict, and repair the blank buyer",who:"ps.build_judge_input_open(PORTAL)",summary:["This takes the run's new OPENs plus any bid opened on an earlier day that never got judged, and rebuilds their text from the enriched snapshot. It deliberately prefers the enriched buyer over the blank one the diff captured. The line that does that names civcast in its comment — this portal is the reason it exists.","On 24 July that list was one bid long: Bid C."],cells:[{label:"Out",paths:[{path:"runs/judge-input-open.json",size:"2 bytes · [] on disk today"}],blocks:[],notes:["The stage model and the disk disagree, and the disk wins. docs/portal-dataflow/civcast.md still records 1 row in this file and 1 row in judge-verdicts.json for 24 July. Both files are [] today, because prep blanks them at the start of every run (stage 2). The model is stale on that point. What is not in doubt: the day folder proves exactly one new bid was opened and every one of the 29 OPENs carries a verdict — 29 OPEN ids, 29 verdict ids, no id in one set and missing from the other."],tables:[]},{label:"Why the rebuild matters — the same bid, before and after",paths:[],blocks:[`{
 "idx": 223,
 "bid_id": "69617000cb97ed358a6335a8",
 "title": "WHCRWA Contract 52",
 "buyer": "",
 "state": "TX",
 "due_date": "2026-08-18",
 "description_full": "Title: WHCRWA Contract 52
 \\nBuyer: \\nState: TX\\nCloses: 2026-08-18
 \\nSource URL: …\\n\\nRFP body (truncated to
 6KB):\\n"
}`],notes:["What prep wrote into judge-input.json at stage 2 (blank buyer, empty body):","What the enriched snapshot holds by stage 5: buyer West Harris County Regional Water Authority, a 373-character scope, 3 documents, contact Melinda Silva, P.E. Without this rebuild the judge would have scored a blank."],tables:[]}],notes:[],then:"one bid, one score"},{n:"6",title:"Judge — the only new verdict of the night",who:"max-bid-judge · AI on runs/judge-input-open.json",summary:['The judge reads the full scope and returns yes, maybe or no with a score out of 100 and a reason. Bid C came back NO at 10: the "contract" the cryptic title hid is ten thousand feet of potable water pipeline. Wrong trade.',"This is the stage that redeems the open. Triage could not tell what WHCRWA Contract 52 was, so it opened it, we spent one HTTP call, and the judge closed it properly."],cells:[{label:"Out",paths:[{path:"runs/judge-verdicts.json",size:"2 bytes · [] on disk today"},{path:"data/civcast/daily/2026-07-24/verdicts.json",size:"30,932 bytes · 29 rows · the durable answer"}],blocks:[],notes:["One file here has no writer at all. runs/judge-verdicts-raw.json holds 3,013 bytes and 3 judge rows in the older key shape (lgs_score / primary_reason without the newer names). Nothing in the repo writes that filename and the sweep skill never mentions it — it is an agent leftover. It carries no date field, but it is datable anyway: all three of its bid ids first appear as verdicts in the 13 July day folder, and the file's own timestamp is 13 July. So it is that night's judge pass, left behind. One of its three rows, minus the long reasoning field:"],tables:[]},{label:"Real record Bid C — NO, 10",paths:[],blocks:[`{
 "bid_id": "69617000cb97ed358a6335a8",
 "title": "WHCRWA Contract 52",
 "buyer": "West Harris County Regional
 Water Authority",
 "state": "TX",
 "due_date": "2026-08-18",
 "verdict": "no",
 "lgs_score": 10,
 "reasoning": "Contract 52 is 10,000 LF of
 12-inch and 36-inch potable water pipeline
 construction plus flow metering and control
 facilities at two MUD water plants. Pipeline
 construction, not vegetation, tree, or debris
 work. Wrong vertical.",
 "would_lgs_bid": "no",
 "score": 10,
 "service_match": "non-fit",
 "scale_match": "above_floor",
 "buyer_match": "adjacent",
 "red_flags": [
 "construction_vertical_water_pipeline"
 ],
 "fit_signals": [],
 "kansas_city_risk": false,
 "closed_award": false
}`,`{
 "bid_id": "6a4c18a62d3281b6c4f21d57",
 "verdict": "no",
 "lgs_score": 10,
 "primary_reason": "CIPP trenchless culvert pipe
 lining plus manhole and pavement repair;
 specialty civil construction with no
 vegetation or debris scope.",
 "red_flags": [
 "storm_water_keyword_trap",
 "cipp_trenchless_pipe_rehab_specialty_trade",
 "paving_and_concrete_repair_scope",
 "wrong_vertical_construction"
 ]
}`],notes:[],tables:[]}],notes:[],then:"today's answers and yesterday's are merged into one day folder"},{n:"7",title:"Write the archive — and carry the old verdicts along",who:"ps.compile_archive(PORTAL, config)",summary:["This is where the portal remembers. Carried decisions are merged with the new ones, yesterday's live verdicts are merged with today's, the funnel is counted, and the day folder is written along with a row in the archive index. 23 day folders exist so far, from 21 June to 24 July.","Bid B's YES 92 has never been re-judged since 20 July. It is in the 24 July file because this step copied it forward."],cells:[{label:"data/civcast/daily/2026-07-24/",paths:[],blocks:[],notes:["Three quiet things in this file. 24 of the 29 verdict rows carry a blank buyer, because they were written on a day before the buyer repair could reach them — only the 5 most recently rebuilt rows have one. 9 of the 29 carry a _first_judged key that no stage in this sweep writes; it is a fossil from stage 8. And a verdict whose bid drops out of the snapshot is deleted here, so verdicts age out with the bid's close date."],tables:[[{header:!0,cells:["File","Holds","Size"]},{header:!1,cells:["new-bids.json","279 rows, the whole enriched snapshot","286,328 b"]},{header:!1,cells:["triage.json","279 decisions, 29 OPEN / 250 SKIP — tomorrow's memory","43,049 b"]},{header:!1,cells:["verdicts.json","29 verdicts, 3 yes / 4 maybe / 22 no","30,932 b"]},{header:!1,cells:["stats.json","the funnel the roll-ups read","468 b"]},{header:!1,cells:["report.md","human summary, rewritten at stage 9","3,591 b"]}]]},{label:"Real record Bid B — carried, not re-judged",paths:[],blocks:[`{
 "bid_id": "6a4bf9ae8d977eed8829222f",
 "title": "Disaster and/or Storm Recovery
 Services",
 "buyer": "",
 "state": "TX",
 "due_date": "2026-08-20",
 "detail_url": "https://www.civcastusa.com/
 project/6a4bf9ae8d977eed8829222f/summary",
 "verdict": "yes",
 "lgs_score": 92,
 "reasoning": "Core Category 1: FEMA Publication
 325-eligible debris clearing and removal on an
 as-needed/standby basis for the City of West
 Lake Hills. This is the real 'storm' - disaster
 debris, not storm sewer pipe. Textbook LGS win
 pattern.",
 "red_flags": [
 "small_municipality_scale_unknown"
 ],
 "would_lgs_bid": "yes",
 "score": 92,
 "primary_reason": "Core Category 1: FEMA
 Publication 325-eligible debris clearing…"
}`],notes:["Every value is written twice under two names — verdict/would_lgs_bid, lgs_score/score, reasoning/primary_reason. Two judge key shapes exist historically and compile writes both so nothing downstream can miss one. The blank buyer here is the residue described on the left."],tables:[]}],notes:[],then:"the portal's own night is over — the shared machinery takes over"},{n:"8",title:"Carry forward — off for this portal, but it ran twice anyway",who:"2.5 · scripts/carry_forward_verdicts.py — this slug is not in the set",summary:[`Some portals lose verdicts when a bid drops out of one night's pull, so a shared script merges yesterday's verdicts back in. CivCast does not need it. Its registry says carry_forward: "engine-internal", and --all only picks up slugs marked "orchestrator". In plain words: this portal already remembers by itself — carrying decisions forward happens twice inside its own sweep, at stage 2 for triage and stage 7 for verdicts. Running the shared script on top applies the merge a second time.`,"It ran on this portal on two dates anyway: 23 June and 15 July. On 15 July it pulled 7 extra verdicts in on top of the merge compile had already done."],cells:[{label:"The evidence it left behind",paths:[{path:"data/civcast/daily/2026-06-23/_carryforward_audit.json",size:"382 bytes"},{path:"data/civcast/daily/2026-07-15/_carryforward_audit.json",size:"386 bytes"}],blocks:[],notes:[`No audit file exists for any date after 15 July, so these look like one-off mistakes rather than standing bad wiring. Both files are missing the ok and skipped keys the current version of the script always writes, which means an older version wrote them. How it came to run at all cannot be settled from the archive: an explicit single-portal run, or an --all run back when the registry still said "orchestrator", both fit. The lasting mark is the 9 _first_judged stamps still riding along in today's verdict file.`],tables:[]},{label:"The 15 July audit, whole file",paths:[],blocks:[`{
 "portal": "civcast",
 "today": "2026-07-15",
 "prior_date_used": "2026-07-13",
 "today_new_judged": 21,
 "carried_forward": 7,
 "carried_forward_not_in_today_snapshot": 7,
 "dropped_too_old": 0,
 "dropped_already_judged_today": 20,
 "dropped_closed_award": 0,
 "final_total": 28,
 "final_yes": 4,
 "final_maybe": 3,
 "final_no": 19,
 "max_age_days": 90
}`],notes:[],tables:[]}],notes:[],then:"the ledger, the report, the board fixtures"},{n:"9",title:"All-time ledger, rewritten report, board cards",who:"2.6 portals_cumulative.py · 2.7 standardize_daily_reports.py · 2.8 dump_yes_for_portalpro.py",summary:["Three shared steps. The ledger walks every day folder of every portal and rebuilds one list of every YES ever surfaced. The report step throws away the compact report.md compile wrote and re-renders it so every portal reads the same. Then the fixture dump keeps every bid this portal ever judged YES, joins it to the newest snapshot row, and writes one flat card each.","Only YES publishes. The 4 MAYBEs from 24 July — including a clearing-and-grubbing job at 50 and a channel slope repair at 48 — never reach the board."],cells:[{label:"All 6 civcast cards in PortalPro/src/fixtures/portal-bids.json (1,470 cards total)",paths:[],blocks:[],notes:['The two mowing cards are the under-call, fixed. Rows 3 and 4 are the Gulf Coast Water Authority canal mowing contracts triage once threw out as "grass mowing". They are on the board at 72 because the judge got a second look. Four of the six cards still show a blank buyer — the same residue as stage 7, since the fixture reads the verdict row first.'],tables:[[{header:!0,cells:["source_bid_id","Title","Score","buyer","has_documents"]},{header:!1,cells:["6a4bf9ae…9222f","Disaster and/or Storm Recovery Services","92","West Lake Hills, Texas","true"]},{header:!1,cells:["6a454369…f729","Restoration/Maintenance Activities with Carter's Slough Miti…","84","blank","true"]},{header:!1,cells:["6a2814b0…85f9","Gulf Coast Water Authority - Canal System Mowing - American …","72","blank","false"]},{header:!1,cells:["6a281f35…85fa","Gulf Coast Water Authority - Canal System Mowing - Juliff Ca…","72","blank","false"]},{header:!1,cells:["6a565f95…9aa7","Phase 2 Clearing & Grubbing and Detention to Serve Madera","65","Montgomery County Municipal Utility Dis…","true"]},{header:!1,cells:["6a4ebc2c…f7df","Locke Tract Detention Pond Desilt","60","blank","true"]}]]}],notes:[],then:"the bid stops being CivCast-shaped"},{n:"10",title:"Onto the shared board, clustered, then the document wall",who:"2.85 publish_to_supabase.py + llm_dedup · 2.85b publish_bid_documents.py · 2.85c run_enrichment_phase.py",summary:["Every YES card is upserted into one shared table keyed on portal plus source id, then union-find groups bids with the same normalized title and state into clusters shared with every other portal. For a plan room this is the important join. The same municipal project routinely also sits on texas-esbd, bidnet or demandstar, and this is the only place those collapse into one row.","Then the document pass tries to download the files. It has never worked here."],cells:[{label:"Real record Bid B on the board",paths:[],blocks:[`{
 "id": "646161325edb638d",
 "portal": "civcast",
 "portal_label": "CivCast USA",
 "source_bid_id": "6a4bf9ae8d977eed8829222f",
 "title": "Disaster and/or Storm Recovery
 Services",
 "buyer": "West Lake Hills, Texas",
 "state": "TX",
 "solicitation_no": null,
 "federal": false,
 "score": 92,
 "verdict": "yes",
 "category": "",
 "contact_name": "Evan Groeschel",
 "contact_email": "egroeschel@westlakehills.gov",
 "contact_phone": "(512) 327-3628",
 "first_seen": "2026-07-20",
 "last_seen": "2026-07-24",
 "has_documents": true
}`],notes:["first_seen: 2026-07-20, last_seen: 2026-07-24 — the board itself records that this bid was found four days before the run this page follows."],tables:[]},{label:"The document pass, and why it is quiet",paths:[],blocks:[],notes:['A non-200 is counted as "skip" and swallowed. No per-file log line, no gap reason written. So a token wall looks exactly like "already uploaded". The engine already flags the wall on the bid itself with _docs_auth_walled — 28 rows carry it on 24 July — and nothing downstream reads that flag.',"Two numbers that do not fit, and are not resolved. data/civcast/PORTAL.md's health snapshot of 14 July reports 50% document coverage for this portal, which is hard to square with a hard token wall. The same snapshot reports 0% contact coverage — yet on 24 July 28 of the 29 enriched rows carry a contact email, captured by the engine. Either the coverage numbers count something different, or an operator uploaded files by hand. One live HTTP check would settle the first; reading the live rows would settle the second. Neither has been done.","It finds the bid's documents list, resolves the cluster, and GETs each download URL at api.civcastusa.com/api/FileStorage/DownloadFileFromProject/…. That URL wants an access token from a free CivCast account. We do not send one.",'The portal also has no entry in the known-walls list, so the operator sees the generic "not yet diagnosed" reason instead of "needs a CivCast account token".'],tables:[]}],notes:[],then:"read the material, write the requirements, dedup again"},{n:"11",title:"Requirements, a second dedup, and the bid pack",who:"2.87 extract_doc_text.py + apply_requirements.py · 2.875 llm_dedup_candidates.py · 2.89 build_bidpack.py",summary:[`Text is pulled out of every uploaded document, a pack is built per cluster, and an agent reads the pack and writes the bid's requirements with a verbatim quote behind each one. Clusters with nothing to read get a neutral "no material" row so the board never shows "not extracted yet".`,"Even with the document wall, CivCast is not empty-handed here. The engine renders a real page_text from the detail JSON — title, owner, contact, document names and the full scope. 29 of the 279 rows carry one on 24 July. That is the material the requirements agent reads."],cells:[{label:null,paths:[],blocks:[],notes:["One dedup rule to know. Two bids whose normalized buyer matches merge whatever their due dates say. The due date only decides when the buyers do not match — or when one of them is blank, which is CivCast's usual state — and then a differing date blocks the merge. On a plan room a twin listing usually shows a different date, so some real duplicates stay split."],tables:[[{header:!0,cells:["Step","What this portal contributes"]},{header:!1,cells:["2.87 document text + requirements","page text, not document bytes — so requirements come from the scope paragraph and the file names"]},{header:!1,cells:["2.875 second dedup pass","matters here: CivCast records the municipal owner while the engineering firm publishes the project, so a twin on another board can carry a different buyer label and only becomes mergeable after a backfill fills the blank"]},{header:!1,cells:["2.89 bid packs","a civcast bid contributes page-civcast.md — title, owner, contact, document names, full scope — and no docs/ text while the byte download is walled"]}]]}],notes:[],then:"what changed, who gets told, did the run finish"},{n:"12",title:"Change detection, email, and the health check",who:"2.88 watch + digests + pipeline_sentinel.py · 2.9 / 2.95 boards",summary:["Today's snapshot is diffed against yesterday's for list-level change markers, the captured page text is stored, and the operator is emailed what is new, what changed and what closes soon. Then the sentinel checks every portal completed every phase, and the monitor and overview boards are rebuilt."],cells:[{label:null,paths:[],blocks:[],notes:["Cadence 1 is unforgiving. One missed day turns the sentinel amber and a few more turn it red, which is exactly what happened after 24 July. The last archive on disk is still that day."],tables:[[{header:!1,cells:["Page text stored for each enriched bid","works — 29 rows carry page_text on 24 July"]},{header:!1,cells:["Watch v2 source re-capture",'off for this slug — registry watch: "none"; it runs only for centralauctionhouse, bonfire-pro and demandstar-pro']},{header:!1,cells:["New-bid and watch digests, deadline alerts","a silent no-op until RESEND_API_KEY is set in data/auth/resend.env"]},{header:!1,cells:["Sentinel",'the live data/portals/sentinel.json row today: status RED, issue "stale: last swept 2026-07-24 (4d ago, cadence 1d)", last_archive: "2026-07-24", 6 bids surfaced. The stage model recorded this as AMBER at 2 days — the file has since moved on, and the file wins']},{header:!1,cells:["Monitor board",`this slug is not in the board's state map, so it shows state "" and core false. Defensible — CivCast really is multi-state and the engine deliberately does not filter by state`]},{header:!1,cells:["Roll-up and scorecard","read stats.json. Its scoring block is the cumulative live verdict count, not the day's new YES — summing it across portals is explicitly forbidden"]}]]}],notes:[],then:null}],d=[{heading:"The quirks that bite — all on one card",tables:[[{header:!0,cells:["Quirk","Consequence"]},{header:!1,cells:["The list JSON carries no owner and no scope","triage sees a title, a state and a date. Buyer and description only arrive at stage 4, and only for the bids triage already opened — so 250 of 279 rows keep a blank buyer forever. Those blanks are not source gaps; we just never fetch that detail."]},{header:!1,cells:["The recall guardrail is prose only","the force-OPEN word list (mow, mowing, vegetation, ROW, right-of-way, clearing, brush, tree, debris, dredge, spray, herbicide) lives in the sweep skill and in no script. Two Gulf Coast Water Authority mowing contracts were already lost this way once and later judged YES 72. Nothing would catch it happening again."]},{header:!1,cells:["Document bytes need a free CivCast account token",`we capture file names and a URL and flag _docs_auth_walled on 28 of 29 enriched rows. The publish step's non-200 is counted as "skip" with no log line, so the wall is indistinguishable from success. The slug has no known-wall entry, so the operator is told "not yet diagnosed".`]},{header:!1,cells:["PORTAL.md reports 50% document coverage and 0% contact coverage","both fight the files. 28 of 29 enriched rows on 24 July carry a contact email. Neither number has been checked against the live rows. Open, not answered."]},{header:!1,cells:["A verdict row's buyer is usually blank","24 of the 29 rows in verdicts.json have none, and 4 of the 6 board cards show none. The buyer repair only reaches rows rebuilt at stage 5."]},{header:!1,cells:["_first_judged on 9 of 29 verdict rows","a fossil from the shared carry-forward script running twice on a portal that is excluded from it (23 June, 15 July). Compile copies each verdict row forward verbatim, so the stamps persist indefinitely."]},{header:!1,cells:["Descriptions keep raw HTML entities","&ldquo; and &rsquo; are stored as literal text, never decoded. That is what the judge reads and what shows on the board."]},{header:!1,cells:["A failed page used to be skipped and the run still reported success — closed 29 July","on 24 July a page the loop could not read was skipped after a one-second sleep, so about 50 rows could vanish and the run still exited clean. Now an unreadable page raises, and so does a walk that reads fewer rows than the list's own Total. index.json records pages_scanned: 14 and list_total_current: 632 against 279 kept; the 353 closed-date drops that close that gap are only in data/civcast/logs/pull_log.txt."]},{header:!1,cells:["A same-day re-run yields 0 new","the prior-archive lookup includes today, so re-running after the archive is written finds nothing new and compiles from carryover."]},{header:!1,cells:['data/civcast/bids/_wtest.json — 10 bytes, contents [{"a": 1}]',"a throwaway write test with no writer anywhere in the repo. Not produced by any stage. Safe to delete; flagged rather than removed."]},{header:!1,cells:["runs/judge-verdicts-raw.json — 3,013 bytes, 3 rows","judge output in the older key shape, written by nothing in the repo and named in no skill. An agent leftover. No date inside it, but its three bid ids all enter the archive as verdicts on 13 July and the file's timestamp is 13 July — that is the night it came from."]},{header:!1,cells:["stats.json's endpoint is the human civcastusa.com/bids URL","not the lambda API the engine actually calls. Do not read it as the data source."]}]],paragraphs:["Generated 5 August 2026 by /portal-stages-visualise from the run of 24 July 2026. Every record above was read off disk from the named file; every count traces to data/civcast/daily/2026-07-24/stats.json, a row count, a byte size taken from the file itself, or a line in data/civcast/logs/pull_log.txt. Where the stage model and the files disagreed — the emptied judge-input-open.json and judge-verdicts.json — the files won and the page says so. Baseline map: docs/portal-dataflow/civcast.md (evidence-cited to file:line). Companion pages: Portal pedia · 01 (BidNet), · 02 (DemandStar)."]}],h="Generated 5 August 2026 by /portal-stages-visualise from the run of 24 July 2026. Every record above was read off disk from the named file; every count traces to data/civcast/daily/2026-07-24/stats.json, a row count, a byte size taken from the file itself, or a line in data/civcast/logs/pull_log.txt. Where the stage model and the files disagreed — the emptied judge-input-open.json and judge-verdicts.json — the files won and the page says so. Baseline map: docs/portal-dataflow/civcast.md (evidence-cited to file:line). Companion pages: Portal pedia · 01 (BidNet), · 02 (DemandStar).",c="docs/portal-dataflow/pedia-civcast.html",u={slug:e,title:t,eyebrow:a,headline:s,lede:n,funnel:o,funnel_note:r,legend:i,stages:l,sections:d,footer:h,source_page:c};export{u as default,a as eyebrow,h as footer,o as funnel,r as funnel_note,s as headline,n as lede,i as legend,d as sections,e as slug,c as source_page,l as stages,t as title};

const e="nc-evp",t="NC eVP: what happens to a bid, stage by stage",a="Portal pedia · 31",s="NC eVP: 224 bids pulled, one bid actually judged",n="Every stage of the run of 28 July 2026, with a real record from the real file at each step. Two bids are followed the whole way. One was thrown out at triage on an earlier night and simply rode along. One is the single bid the judge looked at fresh that night, and it came out YES at score 88.",o=[{value:"224",label:"in snapshot"},{value:"186",label:"carried over"},{value:"38",label:"new tonight"},{value:"18",label:"triage says open"},{value:"5",label:"yes"},{value:"1",label:"maybe"},{value:"12",label:"no"}],i='Every number above is from data/nc-evp/daily/2026-07-28/stats.json (877 bytes). Read the "18 open" carefully: it counts open across the whole snapshot, and 17 of those 18 were opened on earlier nights. Only one new bid was called OPEN that night, so Pass 2 had a one-row input file. The other 17 verdicts were re-injected from an older file. Stage 8 shows how.',r=["Bid A · Doc2109510477 · Biomedical Equipment Maintenance, NC DHHS. Already dead; rides along as a carryover SKIP.","Bid B · 323-P27-05 · Disaster Debris Clearance and Removal, Town of Chapel Hill. The one fresh judgement. YES, 88."],d=[{n:"1",title:"Is this portal due today?",who:"scripts/portal_due.py --batch portals",summary:["The gate looks at the newest dated folder under data/nc-evp/daily/. If it is at least cadence_days old, the slug gets printed and the portal runs. For NC eVP that number is 1, so in theory it runs every day.","In practice it does not. The folder before 2026-07-28 is 2026-07-24. Four days with no run. 41 dated folders exist in total, and the recent ones read 07-15, 07-16, 07-20, 07-21, 07-23, 07-24, 07-28. The gate says daily; the disk says roughly every second day."],cells:[{label:"In",paths:[{path:"data/nc-evp/daily/<date>/",size:"41 folders, newest first"},{path:"data/portals/registry.json",size:"one row per portal"}],blocks:[],notes:["Cadence really lives in Supabase portals.cadence_days; registry.json is the offline fallback (portal_due.py:3-5)."],tables:[]},{label:"The real registry row for this portal",paths:[],blocks:[`{
 "slug": "nc-evp",
 "label": "NC eVP",
 "engine": "",
 "batch": "portals",
 "cadence_days": 1,
 "authed": false,
 "enrich_passes": ["nc-evp docs"],
 "watch": "none",
 "in_cumulative": true,
 "in_portalpro": true,
 "carry_forward": "orchestrator"
}`],notes:["Note engine is the empty string. This portal shares no code with the platform engines. Every script it runs is its own."],tables:[]}],notes:[],then:"the slug is printed, so a child agent is handed the runbook"},{n:"2",title:"A child agent is sent to run the sweep",who:"Agent(general-purpose) → .claude/skills/nc-evp-sweep/SKILL.md",summary:["NC eVP goes out in Batch B of the nightly fan-out. There is no run_daily.py here. A child agent reads the runbook and executes the six phases by hand, one script at a time.","One rule matters more than the rest: the pull must run in the foreground. A child that backgrounds this crawl and polls for it loses the bids it is holding in memory and stalls forever. That happened on 2026-07-15."],cells:[{label:"In",paths:[{path:".claude/skills/nc-evp-sweep/SKILL.md",size:"the runbook the child follows"}],blocks:[],notes:["Dispatched from .claude/skills/portals/SKILL.md:177. The child itself is a process, not a file, so nothing on disk proves it ran except the timestamps it left."],tables:[]},{label:"The timestamps it left (file mtimes, local time)",paths:[],blocks:[`14:11 bids/all-bids.json pull done
14:11 runs/triage-input.json prep done
14:13 runs/triage-verdicts.json Pass 1 done
14:14 runs/judge-input-open.json 1 row
14:14 runs/judge-verdicts-carryover.json
14:19 runs/judge-verdicts.json Pass 2 done
14:19 daily/2026-07-28/stats.json compile done
17:35 daily/2026-07-28/verdicts.json carry-forward
17:37 daily/2026-07-28/report.md restandardised
17:38 PortalPro fixture rebuilt`],notes:["The portal's own work took eight minutes. The shared machinery finished it three hours later."],tables:[]}],notes:[],then:"a headless browser opens the state's bid list"},{n:"3",title:"Pull: walk 23 pages, then open all 224 bids",who:"data/nc-evp/scripts/pull_bids.py",summary:["The list is drawn by JavaScript, so we drive a headless Chrome. It walks the grid ten rows at a time until there is no next-page link, then it visits each bid's own page for the full text. No login anywhere. The whole site is public.","Unusually for us, the list page is already rich. Column 2 of the grid is a full scope paragraph. That paragraph alone carries the bid even when the detail page misbehaves, which it often does."],cells:[{label:"In → Out",paths:[{path:"https://evp.nc.gov/solicitations/?status=0",size:"the JS grid"},{path:"https://evp.nc.gov/solicitations/details/?id=<guid>",size:"once per bid"},{path:"data/nc-evp/bids/all-bids.json",size:"631,893 bytes · 224 rows"},{path:"data/nc-evp/bids/index.json",size:"189 bytes"},{path:"data/nc-evp/logs/pull_bids_log.txt",size:"2,276 bytes"}],blocks:[`=== NC eVP pull · 2026-07-28T19:00:59.730998+00:00 ===
 page 1: 10 rows, 10 new (total 10)
 …
 page 23: 4 rows, 4 new (total 224)
 no next-page link found — stopping pagination

list phase done: 224 rows captured across 23 pages
fetching detail pages for 224 bids
detail phase: 224/224 ok in 584.0s`],notes:[],tables:[]},{label:"Real record Bid A",paths:[],blocks:[`{
 "id": "3ec4e0df-3685-f111-ab0f-001dd80bcb64",
 "bid_id": "Doc2109510477",
 "due_date": "2026-09-09",
 "solicitation_number": "Doc2109510477",
 "title": "DSOHF 30-26060 Biomedical
 Equipment Maintenance IFB",
 "agency": "DEPARTMENT OF HEALTH AND HUMAN
 SERVICES - DHHS",
 "type": "",
 "opens": "7/21/2026",
 "closes": "9/9/2026 2:00 PM",
 "status": "Open",
 "grid_description": "This Invitation for Bids
 (IFB) is to solicit competitive bids from
 qualified Vendors to provide an onsite
 biomedical equipment maintenance program…",
 "state": "NC",
 "_headers": ["Solicitation Number. sort descending",
 "Project Title. sort descending", …],
 "_detail_ok": true
}`],notes:['All 224 rows carry state: "NC" and a non-empty grid_description. bid_id is the solicitation number, not the page guid. That choice is what every later file joins on.'],tables:[]}],notes:['The column names are junk, so we count instead. Every header on that grid ends in " . sort descending", so looking a column up by name quietly returns nothing. The parser maps by position: 0 solicitation number, 1 title, 2 description, 3 opening date, 4 posted date, 5 status, 6 department (pull_bids.py:213-237). If NC ever reorders the grid, we mislabel every field and nothing complains.','224 of 224 detail pages say "ok", and 35 of them are still loading. index.json reports detail_ok: 224. But 35 of the saved page texts contain the literal word Loading... where the attachment list and the commodity codes should be. The page was read before its own panels finished drawing. Bid B is one of the 35. Nothing upstream flags this; only the judge notices, at stage 8.'],then:"a repair script exists for this file, and it did not run"},{n:"4",title:"The stage that never happens",who:"data/nc-evp/scripts/fix_headers.py · did NOT run",summary:[`This script strips the " sort descending" suffix off the header names and rebuilds the fields from the raw cells. It was written for the bug the pull already fixes by counting columns, and it is not in the runbook's six-phase list.`,"It did not run on 28 July. Proof: every time it runs it stamps a _headers_clean key on each row (fix_headers.py:37). Zero of the 224 rows in all-bids.json have that key."],cells:[{label:"Would read and rewrite",paths:[{path:"data/nc-evp/bids/all-bids.json",size:"in place, same file both ways"}],blocks:[],notes:["Evidence: fix_headers.py:32 reads, fix_headers.py:65 writes."],tables:[]},{label:"The check, run against the live file",paths:[],blocks:[`rows in all-bids.json 224
rows carrying _headers_clean 0`],notes:["If it ever does run, it breaks a date. fix_headers.py:56 overwrites closes but never recomputes due_date, which was set once at pull_bids.py:245. The two dates would drift apart silently. The runbook also claims prep_bids.py strips the header suffix. It does not; it touches no headers at all."],tables:[]}],notes:[],then:"today's list is compared with the last one we kept"},{n:"5",title:"Split the pile into new and already-seen",who:"data/nc-evp/scripts/prep_bids.py",summary:["Today's 224 bids are matched against the last archived triage file, which for this run was 2026-07-24. Anything already decided keeps its old decision and costs nothing. Only genuinely new bids go to the AI.","186 carried over. 38 were new. This is where Bid A and Bid B part company: Bid A was already a SKIP from an earlier night, Bid B had never been seen before."],cells:[{label:"In → Out",paths:[{path:"data/nc-evp/bids/all-bids.json",size:"224 rows"},{path:"data/nc-evp/daily/2026-07-24/triage.json",size:"the memory"},{path:"runs/triage-input.json",size:"8,514 bytes · 38 rows"},{path:"runs/triage-carryover.json",size:"25,740 bytes · 186 rows"},{path:"runs/judge-input.json",size:"425,922 bytes · 224 rows"},{path:"runs/_funnel.json",size:"156 bytes"}],blocks:[`{
 "date": "2026-07-28",
 "snapshot_total": 224,
 "carryover_count": 186,
 "triage_input_count": 38,
 "prior_archive_ids_compared_against": 214
}`],notes:[],tables:[]},{label:"Real record Bid A, in the carryover file",paths:[],blocks:[`{
 "idx": 0,
 "bid_id": "Doc2109510477",
 "decision": "SKIP",
 "reason": "biomedical equipment maintenance,
 wrong vertical"
}`,`{
 "idx": 93,
 "bid_id": "323-P27-05",
 "title": "Disaster Debris Clearance and
 Removal Services",
 "agency": "TOWN OF CHAPEL HILL",
 "state": "NC",
 "closes": "8/25/2026 12:00 PM"
}`],notes:["Four fields. That is Bid A's entire cost tonight: it was pulled, it was matched, its old answer was copied forward. No AI read it."],tables:[]}],notes:["The memory is a file, not a database. Delete daily/2026-07-24/triage.json and tomorrow's run re-triages all 224 bids from scratch. Also worth noting: judge-input.json is built for all 224 bids, even though only a handful will ever be judged. It carries the detail-page text plus the grid description glued together and capped at 5,500 characters, which is why it is 425 KB."],then:"the 38 new titles go to the first AI"},{n:"6",title:"Pass 1: worth a proper look, yes or no",who:"max-triage · AI",summary:["An agent reads the 38 new rows and calls each one OPEN or SKIP. It sees a title, an agency, a state and a closing date. Nothing else. There is no keyword filter in front of this: every new bid gets read.","The answer that night: 37 SKIP, 1 OPEN. The single OPEN is Bid B."],cells:[{label:"In → Out",paths:[{path:"runs/triage-input.json",size:"38 rows"},{path:"runs/triage-verdicts.json",size:"7,422 bytes · 38 rows"}],blocks:[],notes:["No script writes this file. The agent writes it directly. There is no code anywhere that validates the shape or checks that all 38 ids came back. The child agent's own coverage check is the only guard, and that lives in a prompt, not in a program.","Counted straight off the file: 37 decisions read SKIP, 1 reads OPEN."],tables:[]},{label:"Real record Bid B, opened",paths:[],blocks:[`{
 "idx": 93,
 "bid_id": "323-P27-05",
 "title": "Disaster Debris Clearance and
 Removal Services",
 "decision": "OPEN",
 "reason": "Cat 1 disaster debris removal"
}`],notes:["Bid A is not in this file at all. It never reached this stage. Its SKIP was decided on some earlier night and simply travelled along in the carryover file."],tables:[]}],notes:[],then:"the OPENs get their full text pulled back out"},{n:"7",title:"Build the judge's plate",who:"filter step · no script, the child agent does it",summary:["Take the big 224-row judge-input.json, keep only the ids Pass 1 called OPEN, hand that to Pass 2. On a normal night this file has a handful of rows.","On 28 July it had one. 1,557 bytes. That is the entire fresh workload of the evening."],cells:[{label:"In → Out",paths:[{path:"runs/judge-input.json",size:"425,922 bytes · 224 rows"},{path:"runs/triage-verdicts.json",size:"the 1 OPEN id"},{path:"runs/judge-input-open.json",size:"1,557 bytes · 1 row"}],blocks:[],notes:["Nothing in the repo writes this file either. The model doc records no code evidence for the filter, the input or the output. It is a step that exists only because an agent is told to do it. If the agent filters wrong, no test catches it."],tables:[]},{label:"The whole file, one record Bid B",paths:[],blocks:[`{
 "idx": 93,
 "bid_id": "323-P27-05",
 "title": "Disaster Debris Clearance and
 Removal Services",
 "agency": "TOWN OF CHAPEL HILL",
 "state": "NC",
 "closes": "8/25/2026 12:00 PM",
 "detail_url": "https://evp.nc.gov/solicitations/
 details/?id=447589f3-b38a-f111-ab0f-001dd812e0a9",
 "description_full": "Solicitation: 323-P27-05
 … Description / RFP body:
 Solicitation Number
 Department
 Status Reason
 Open
 …
 Attachments
 If you require any file to be delivered in an
 alternative format in compliance with the
 Americans with Disabilities Act, please do not
 hesitate to contact us.
 Loading...
 Additional Commodity Codes
 …
 Loading...

 The Town is requesting proposals from experienced
 and qualified contractors to provide emergency
 disaster recovery services including, but not
 limited to, clean-up, demolition, removal,
 reduction and disposal of debris resulting from a
 natural or manmade disaster as directed by the
 Town."
}`],notes:["Look at the two Loading... markers. The detail page gave us labels with no values. The only real sentence in this record is the last one, and it came from the grid, not the detail page."],tables:[]}],notes:[],then:"one bid in, eighteen verdicts out"},{n:"8",title:"Pass 2: score it, and quietly re-add yesterday's scores",who:"max-bid-judge · AI + runs/judge-verdicts-carryover.json",summary:["The judge reads the one OPEN bid and returns yes/maybe/no, a score out of 100, the reasoning and the signal lists. NC is outside LGS's eight core states, so every yes or maybe here carries an out_of_core_state_NC flag for the operator.","Then something the model doc does not describe happens. judge-verdicts.json comes out with 18 rows, not one. The other 17 are lifted from runs/judge-verdicts-carryover.json, which was written at 14:14 the same evening, five minutes before judge-verdicts.json was written at 14:19."],cells:[{label:"In → Out",paths:[{path:"runs/judge-input-open.json",size:"1 row"},{path:"runs/judge-verdicts-carryover.json",size:"15,711 bytes · 17 rows · written 14:14"},{path:"runs/judge-verdicts.json",size:"17,011 bytes · 18 rows · written 14:19"}],blocks:[`judge-verdicts.json 18 rows
 of those, ids also in the
 carryover file 17
 judged fresh tonight 1 (323-P27-05)

triage-carryover.json 186 rows
 169 SKIP + 17 OPEN ← the same 17`],notes:['The model doc is out of date here. docs/portal-dataflow/nc-evp.md lists judge-verdicts-carryover.json under "files on disk with no modeled writer", calls it stale at 2026-07-22 with 10 rows, and says nothing reads it. On disk it now has 17 rows, was written during this run, and every single one of its ids is inside judge-verdicts.json. It is part of the flow. It still has no script writing it and no script reading it, which is the actual problem.'],tables:[]},{label:"Real record Bid B, YES at 88",paths:[],blocks:[`{
 "bid_id": "323-P27-05",
 "would_lgs_bid": "yes",
 "score": 88,
 "category": "Disaster Debris Removal",
 "primary_reason": "Town wants a contractor for
 disaster debris clean-up, removal, reduction and
 disposal — that's the heart of what LGS does,
 full stop.",
 "service_match": "core",
 "scale_match": "unknown",
 "buyer_match": "core",
 "red_flags": [
 "out_of_core_state_NC",
 "thin_description_pull_rfp_packet"
 ],
 "fit_signals": [
 "category_1_disaster_debris_exact_title_match",
 "municipal_buyer_town",
 "scope_sentence_confirms_cleanup_removal_
 reduction_disposal",
 "demolition_paired_with_debris_removal_
 still_core"
 ],
 "kansas_city_risk": false,
 "closed_award": false,
 "elaboration": "…The detail page mostly failed to
 render (attachments, commodity codes, department,
 owner, and dates all show as loading/blank,
 procurement type shows the raw dropdown instead
 of a value), so scale and term are unknown and
 the real terms are still sitting in the RFP
 packet. Score on shape alone, flag the state and
 the unread packet for the operator."
}`,`{
 "bid_id": "Doc2247657580",
 "would_lgs_bid": "yes",
 "score": 82,
 "category": "Category 2/4 hybrid - utility/highway
 ROW vegetation + regional grounds maintenance",
 "red_flags": [
 "out_of_core_state_NC",
 "buyer_is_state_national_guard_not_
 typical_LGS_buyer"
 ],
 "_first_judged": "2026-07-16",
 "id": "9abb5a8f-6a80-f111-ab0f-001dd803db57"
}`],notes:["The judge caught the broken page and said so. It scored 88 from the title and one grid sentence, and told the operator to open the packet.","Two extra fields give it away: _first_judged and id. The freshly judged record has neither. Four different key shapes sit inside one 18-row file."],tables:[]}],notes:[],then:"everything is folded into the day's folder"},{n:"9",title:"Write the day down",who:"data/nc-evp/scripts/compile_insights.py",summary:["The carried-over triage decisions are merged with tonight's, verdicts are paired back to their snapshot rows, and the whole thing is written into a dated folder that never changes again. This folder is tomorrow's memory and every roll-up's source.",`186 carried plus 38 new gives 224 triage rows: 206 SKIP, 18 OPEN. That is where the funnel's "18 open" comes from.`],cells:[{label:"Out · data/nc-evp/daily/2026-07-28/",paths:[],blocks:[`| 2026-07-24 | 214 | 20 | 18 | **4** | [report](2026-07-24/report.md) |
| 2026-07-28 | 224 | 38 | 18 | **5** | [report](2026-07-28/report.md) |`],notes:["Plus one appended row in data/nc-evp/daily/INDEX.md. Re-running the day replaces that row and rewrites the folder, so the step is safe to repeat."],tables:[[{header:!0,cells:["File","Holds","Size"]},{header:!1,cells:["new-bids.json","224 rows, the whole snapshot","631,893 B"]},{header:!1,cells:["triage.json","224 decisions, 206 SKIP / 18 OPEN","33,159 B"]},{header:!1,cells:["verdicts.json","18 rows when compile writes it, 47 after stage 10","51,575 B on disk now"]},{header:!1,cells:["stats.json","the funnel counts at the top of this page","877 B"]},{header:!1,cells:["report.md","human summary, rewritten later at stage 11","10,088 B"]}]]},{label:"Real record Bid A in the archive",paths:[],blocks:[`{
 "idx": 0,
 "bid_id": "Doc2109510477",
 "decision": "SKIP",
 "reason": "biomedical equipment maintenance,
 wrong vertical"
}`,`{
 "bid_id": "323-P27-05",
 "would_lgs_bid": "yes",
 "score": 88,
 "category": "Disaster Debris Removal",
 "bid_key": "nc-evp:323-P27-05",
 "_first_judged": "2026-07-28"
}`],notes:["One quiet failure mode. If runs/judge-verdicts.json is missing when this runs, verdicts.json is written empty and the day reports zero YES. Nothing errors.","Bid A's journey ends here, exactly as it began: four fields, copied. Tomorrow's run will read this row and copy it again.","Two fields are added on the way in: a portal-prefixed key and the date it was first judged. That date is what keeps it alive for the next ninety days."],tables:[]}],notes:[],then:"the portal's own work is done, and the shared machinery takes over"},{n:"10",title:"Carry forward, and yes, this portal is in it",who:"2.5 · scripts/carry_forward_verdicts.py --all",summary:['The registry says carry_forward: "orchestrator". In plain terms: the shared script runs on NC eVP. Portals marked engine-internal or none are skipped because they already remember verdicts themselves. This one does not, so the safety net applies.',"It takes the previous day's verdicts and merges them into today's file, so a bid judged YES last week stays in front of the operator even when NC drops it off the list. Verdicts older than 90 days, already judged today, or marked as awarded are thrown out.","This is a different net from the one at stage 5. Stage 5 carries triage decisions. This carries judge verdicts. Both run on this portal."],cells:[{label:"In → Out",paths:[{path:"daily/2026-07-24/verdicts.json",size:"the prior day"},{path:"daily/2026-07-28/verdicts.json",size:"18 rows in, 51,575 bytes and 47 rows out"},{path:"daily/2026-07-28/_carryforward_audit.json",size:"424 bytes"}],blocks:[],notes:["All 29 carried bids had vanished from today's list. carried_forward_not_in_today_snapshot equals carried_forward exactly. Without this step, 29 already-scored bids would have disappeared from the operator's view overnight.","Counted off the finished file: 47 rows, 23 yes / 6 maybe / 18 no, of which 29 carry a _carryforward_from stamp."],tables:[]},{label:"The audit file, in full",paths:[],blocks:[`{
 "portal": "nc-evp",
 "ok": true,
 "skipped": false,
 "today": "2026-07-28",
 "prior_date_used": "2026-07-24",
 "today_new_judged": 18,
 "carried_forward": 29,
 "carried_forward_not_in_today_snapshot": 29,
 "dropped_too_old": 0,
 "dropped_already_judged_today": 17,
 "dropped_closed_award": 0,
 "final_total": 47,
 "final_yes": 23,
 "final_maybe": 6,
 "final_no": 18,
 "max_age_days": 90
}`],notes:["Read dropped_already_judged_today: 17 next to stage 8. Those are the same 17 verdicts the child agent had already re-injected by hand three hours earlier. The proper script found them, saw duplicates, and dropped them. The hand-rolled step at stage 8 was doing work this script was going to do anyway."],tables:[]}],notes:[],then:"the ledger, the report and the board fixture are rebuilt"},{n:"11",title:"Ledger, report, board cards",who:"2.6 portals_cumulative.py · 2.7 standardize_daily_reports.py · 2.8 dump_yes_for_portalpro.py",summary:["Three shared steps in a row. The cumulative ledger walks every dated folder this portal has and dedupes by bid. The report writer overwrites the report compile just made, using one layout every portal shares. Then the board fixture is rebuilt: YES verdicts joined to their snapshot rows and their enriched detail links."],cells:[{label:"Out",paths:[{path:"data/portals/cumulative-yes.json + .md",size:"all portals"},{path:"daily/2026-07-28/report.md",size:"10,088 bytes · rewritten 17:37"},{path:"PortalPro/src/fixtures/portal-bids.json",size:"2,153,413 bytes · 1,470 cards, 27 of them nc-evp"}],blocks:[`- Snapshot: **224** open bids
- Carryover: 186 · NEW today: 38
- Triage: 18 OPEN / 206 SKIP
- Scored: **23 YES / 6 MAYBE / 18 NO**

- **[88] Disaster Debris Clearance and Removal
 Services** — TOWN OF CHAPEL HILL · closes 2026-08-25
- **[88] 54-TJK-01-PR31880** — — · closes unknown`],notes:[`The blank buyer and "closes unknown" on the second line are not a rendering bug. That bid was carried forward and is no longer in today's snapshot, so there is no row left to read its buyer and date from. Honest blanks.`],tables:[]},{label:"Real board card Bid B",paths:[],blocks:[`{
 "id": "205bd0359df576d2",
 "portal": "nc-evp",
 "portal_label": "NC eVP",
 "source_bid_id": "323-P27-05",
 "title": "Disaster Debris Clearance and
 Removal Services",
 "buyer": "TOWN OF CHAPEL HILL",
 "state": "NC",
 "federal": false,
 "score": 88,
 "verdict": "yes",
 "due_date": "2026-08-25",
 "contact_name": null,
 "contact_email": null,
 "contact_phone": null,
 "red_flags": [
 "out_of_core_state_NC",
 "thin_description_pull_rfp_packet"
 ],
 "fit_signals": [],
 "first_seen": "2026-07-28",
 "last_seen": "2026-07-28",
 "has_documents": false
}`],notes:["Two things went missing on the way onto the board. fit_signals arrived empty although the verdict had four of them. And all three contact fields are null, and that is true of all 27 nc-evp cards in the fixture, not just this one."],tables:[]}],notes:['Six MAYBEs cannot reach the board. At dump_yes_for_portalpro.py:133 the pair ("yes","maybe") is handed only to federal portals. NC eVP is not one, so it gets ("yes",) alone. The fixture holds 27 nc-evp cards and every one has verdict: "yes", while the carry-forward audit for the same night counted final_maybe: 6. Those six sit in the archive and no human ever sees them, on a portal whose runbook explicitly tells the operator to review by hand because NC is out of core state.'],then:"bids stop being portal-shaped here"},{n:"12",title:"Onto the shared board, and into clusters",who:"2.85 · publish_to_supabase.py → llm_dedup_candidates.py → apply_llm_dedup.py",summary:["This is where NC eVP stops being its own portal. Its YES bids are pushed into the shared bids table and joined into clusters with every other portal's bids, so the same solicitation seen here and on Bonfire becomes one row. An AI then confirms the cross-portal duplicates.","Dedup is incremental: only pairs that touch a cluster created or changed today are judged. Old settled pairs are not re-litigated."],cells:[{label:"In → Out",paths:[{path:"PortalPro/src/fixtures/portal-bids.json",size:"27 nc-evp cards"},{path:"daily/2026-07-28/stats.json",size:"becomes the sweep_runs row"},{path:"supabase:bids",size:"upsert on (portal_key, source_bid_id)"},{path:"supabase:clusters",size:"upsert on (id), then bids.cluster_id updated"},{path:"data/portals/llm-dedup-candidates.json",size:"pairs to judge"}],blocks:[],notes:[],tables:[]},{label:"Why the join key matters here",paths:[],blocks:[],notes:["No Supabase row is quoted on this page. Everything here was read off disk. The board card at stage 11 is the last artefact this run wrote to a file; past that point the evidence lives in the database and would need a live query, so it is not shown rather than guessed at.","The upsert key is (portal_key, source_bid_id), and source_bid_id for this portal is the solicitation number set way back at pull_bids.py:243, not the page guid. Bid B is 323-P27-05 in every file from the pull to this table. That consistency is deliberate and it is the reason nothing has to be renamed on the way in."],tables:[]}],notes:[],then:"now the documents are fetched, after publishing and not before"},{n:"13",title:"Documents, then requirements",who:"2.86 open folders/_lib/nc_evp_doc_capture.py · 2.87 requirements extraction",summary:["This is the portal's own enrichment pass, and it is the good news story. NC eVP's attachments are plain public links on the same Dynamics page. No login, no paywall, no browser-detection fight. The pass re-opens each surfaced bid's page, collects the attachment links, downloads each file, and stores the page text alongside.","Coverage is good: of the 27 nc-evp cards in the fixture, 24 already show has_documents: true — 89%. Then an agent reads those documents and pulls out the bid's requirements with verbatim quotes, written per cluster rather than per portal."],cells:[{label:"In → Out",paths:[{path:"supabase:bids?portal_key=eq.nc-evp&verdict=in.(yes,maybe)",size:"the work list"},{path:"https://evp.nc.gov/_entity/annotation/<guid>/<guid>",size:"the file itself"},{path:"supabase-storage:bid-docs/{cluster_id}/documents/",size:"the PDFs"},{path:"supabase:bid_documents + bid_page_text",size:"rows"},{path:"data/portals/requirements-input.json",size:"fed to the extractor agent"}],blocks:[],notes:["Order is the trap. This runs after publishing and keys on cluster_id. A bid that never got published gets no documents, ever. And because the board only ever receives YES rows for this portal (stage 11), the pass that nominally covers yes and maybe is in practice YES-only here."],tables:[]},{label:"What it is going after: the real attachment list from Bid A's page text",paths:[],blocks:[`Attachments
7 days ago
 30-26060 Biomedical Equipment IFB.pdf (1.29 MB)
5 days ago
 30-26060 Addendum 1 Attachment G update.docx
 (454.42 KB)
5 days ago
 All equipment lists.zip (274.59 KB)`,`Attachments
If you require any file to be delivered in an
alternative format in compliance with the Americans
with Disabilities Act, please do not hesitate to
contact us.
 Loading...`],notes:["Bid A will never see this pass. It is a SKIP, so it never publishes. But its page shows what a healthy NC eVP detail page looks like: real file names, real sizes, three documents ready to take.","Same portal, same night. One page finished drawing, the other did not. That is why Bid B's card says has_documents: false and why this later pass, which re-fetches with a different browser, is the thing that saves it."],tables:[]}],notes:[],then:"filled-in buyers and dates make new duplicate pairs comparable"},{n:"14",title:"Dedup, second pass",who:"2.875 · llm_dedup_candidates.py → bid-dedup-judge → apply_llm_dedup.py",summary:["Enrichment just filled in buyers and due dates that were blank an hour ago. Pairs that could not be compared before can be compared now, so dedup runs again over that residue only.","If the candidate file comes back with zero pairs, the run stops there. Re-running the apply step on a stale merges file is the failure this rule exists to prevent."],cells:[{label:"In → Out",paths:[{path:"supabase:clusters + dedup_adjudications",size:"what has already been decided"},{path:"data/portals/llm-dedup-candidates.json",size:"{pairs, cluster_count}"},{path:"data/portals/llm-dedup-merges.json",size:"list of {a,b} · no code evidence for its writer"}],blocks:[],notes:[],tables:[]}],notes:[],then:"what changed since last time, and did every phase run?"},{n:"15",title:"Change signals, emails, and the backstop",who:"2.88 · watch_list_signals.py · bid_watch.py · new_bids_email.py · pipeline_sentinel.py",summary:[`The registry says watch: "none", so there is no second visit to NC eVP to look for changes. But the free list-level watcher loops over every portal in the registry regardless, comparing today's snapshot with the last archived one.`,"For this portal that partly works and partly does not, and the difference is worth knowing."],cells:[{label:null,paths:[],blocks:[],notes:["The sentinel is the real backstop for the cadence gap at stage 1. If NC eVP is never printed as due and never runs, nothing else in the pipeline notices. The sentinel is what turns that silence into a red mark."],tables:[[{header:!0,cells:["Check","Does it fire for NC eVP?"]},{header:!1,cells:["Due date moved","Yes. The snapshot carries due_date."]},{header:!1,cells:['Status left "Open"',"Yes. The snapshot carries status."]},{header:!1,cells:["Addendum posted","No. The check reads an addendum counter this portal does not publish, even though Bid A's page plainly shows an addendum dated 7/23/2026 in its text."]},{header:!1,cells:["Watch v2 source re-capture",'Not wired. watch: "none".']},{header:!1,cells:["Discovery and watch emails","Silent no-op until RESEND_API_KEY is set in data/auth/resend.env."]},{header:!1,cells:["Sentinel","Runs. Checks every portal completed every phase and writes data/portals/sentinel.json. Exits 1 if any portal is red."]}]]}],notes:[],then:"and finally, in front of a person"},{n:"16",title:"Where an NC eVP bid actually lands",who:"2.89 build_bidpack.py · 2.9-2.96 boards · 3-4.99 roll-up + scorecard.py",summary:["Bid B ends up in four places: as a card on the board at shessi.dev/lgs, as a folder of markdown in data/bidpacks/ with its documents and requirements written out, as a line in the morning discovery email once the mail key exists, and as one row in the day's roll-up.","The end is not the database. The database is the shared middle. The end is the board, the packs, the digests and the two HTML boards the operator opens by double-click."],cells:[{label:null,paths:[],blocks:[],notes:[`One counting rule. Never add up the per-portal scoring.yes figures from each stats.json. They mean different things on different portals. On this page, "5 yes" is what happened inside NC eVP's own Pass 2 that night; "23 yes" is what the operator actually saw after carry-forward; "27" is how many nc-evp cards were on the board. All three are true and none is the same number. The only YES count we report externally comes from scripts/scorecard.py.`],tables:[]}],notes:[],then:null}],l=[{heading:"The quirks that bite",tables:[[{header:!0,cells:["Quirk","Consequence"]},{header:!1,cells:['Grid headers all end in " . sort descending", so columns are mapped by position',"if NC reorders the grid we mislabel every field silently; there is no header check left to catch it"]},{header:!1,cells:["_detail_ok: true does not mean the page rendered","35 of 224 saved page texts on 2026-07-28 still say Loading... where attachments and codes belong; only the judge noticed, and only on the one bid it read"]},{header:!1,cells:["Contact is effectively unavailable: 8% coverage, and 0 of 27 board cards have an email","every NC eVP card reaches the operator with no one to call; the contact must come out of the PDF"]},{header:!1,cells:["MAYBE never reaches the board (dump_yes_for_portalpro.py:133 gives yes+maybe to federal portals only)","6 MAYBEs that night are archived and invisible, on a portal whose own runbook tells the operator to review by hand"]},{header:!1,cells:["judge-verdicts-carryover.json has no writer and no reader in any script","17 of the 18 verdicts in this run came through it; the model doc still calls it a stale stray, and the carry-forward script dropped all 17 as duplicates three hours later"]},{header:!1,cells:["Three files in the flow (triage verdicts, the OPEN-only judge input, judge verdicts) are written by an agent, not a program","no schema check, no coverage check, no test; a malformed write looks exactly like a quiet night"]},{header:!1,cells:["fix_headers.py sits in the scripts folder and is not in the runbook","it did not run on 2026-07-28 (zero rows carry _headers_clean); if it ever does, it rewrites closes without recomputing due_date"]},{header:!1,cells:["The runbook says prep_bids.py exits 2 when new bids are pending","it never calls exit; any child branching on code 2 is branching on something that cannot happen"]},{header:!1,cells:["Cadence says every day; the archive says every second or third day","07-24 then 07-28 on this run, four days apart; the sentinel is the only thing that would flag a longer silence"]},{header:!1,cells:["NC is outside LGS's eight core states","every yes and maybe carries out_of_core_state_NC; the operator decides, always"]},{header:!1,cells:["data/nc-evp/PORTAL.md is still the auto-generated draft","its field map, pull recipe and document section are all TODO, and it claims engine nc-evp while the registry says the engine is empty"]},{header:!1,cells:["Four _pull*.log files sit in runs/ with no writer in any script","the real pull log is logs/pull_bids_log.txt; the ones in runs/ look like shell redirects nobody owns"]}]],paragraphs:["Generated 5 August 2026 by /portal-stages-visualise from the run of 28 July 2026. Every record above was read from the named file on disk; every count traces to data/nc-evp/daily/2026-07-28/stats.json, a row count, a byte size, or the pull log. Where the model map docs/portal-dataflow/nc-evp.md disagrees with the files, the files win and the page says so. Three places that happens: the carryover verdicts file at stage 8, the 2026-07-24 figures the map quotes throughout, and the 26 board cards it counts against 27 on disk. Baseline map: docs/portal-dataflow/nc-evp.md (evidence-cited to file:line)."]}],h="Generated 5 August 2026 by /portal-stages-visualise from the run of 28 July 2026. Every record above was read from the named file on disk; every count traces to data/nc-evp/daily/2026-07-28/stats.json, a row count, a byte size, or the pull log. Where the model map docs/portal-dataflow/nc-evp.md disagrees with the files, the files win and the page says so. Three places that happens: the carryover verdicts file at stage 8, the 2026-07-24 figures the map quotes throughout, and the 26 board cards it counts against 27 on disk. Baseline map: docs/portal-dataflow/nc-evp.md (evidence-cited to file:line).",c="docs/portal-dataflow/pedia-nc-evp.html",p={slug:e,title:t,eyebrow:a,headline:s,lede:n,funnel:o,funnel_note:i,legend:r,stages:d,sections:l,footer:h,source_page:c};export{p as default,a as eyebrow,h as footer,o as funnel,i as funnel_note,s as headline,n as lede,r as legend,l as sections,e as slug,c as source_page,d as stages,t as title};

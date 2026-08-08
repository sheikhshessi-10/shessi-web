const e="planhouseplanroom",t="PlanHouse PlanRoom: what happens to a bid, stage by stage",a="Portal pedia · 37",n="PlanHouse PlanRoom: the night nothing was judged a YES",s="Every stage of the run of 28 July 2026, with a real record from the actual file at each step. 83 open projects came in. 18 were new. Five reached the judge and all five came back NO. The two YES rows this portal shows for that day were both scored on earlier nights and carried forward, one on 10 July and one on 14 June. And the tail of the run — the logged-in document pass, the requirements chain, the second dedup, and the packs and boards — never ran that night, on purpose.",o=[{value:"83",label:"in snapshot"},{value:"65",label:"carried over"},{value:"18",label:"new tonight"},{value:"7",label:"triage says open"},{value:"5",label:"judged tonight"},{value:"0",label:"yes · 0 maybe"}],r="Every number above is from data/planhouseplanroom/daily/2026-07-28/stats.json (933 bytes): snapshot_total 83, carryover_count 65, new_to_triage 18, triage {open 7, skip 76}, scoring {yes 0, maybe 0, no 5}. Careful with that last one: report.md in the same folder, written three hours later, says 2 YES / 2 MAYBE / 7 NO. Both files are right about different moments. Stage 8 explains the gap.",i=["Bid A · 20687, West Jones High School Re-Roof. New tonight, dies at triage.","Bid B · 20688, Town of Georgetown CDBG Drainage Improvements. New tonight, opened by an override, judged NO at 28."],l=[{n:"0",title:"Is tonight a PlanHouse night",who:"scripts/portal_due.py --batch portals",summary:["This portal does not run daily. Its three-day cadence is read live from the Supabase portals.cadence_days column, which is edited from the PortalPro Matrix; data/portals/registry.json holds the same number only as an offline fallback. With the cadence in hand the gate looks at the newest folder under data/planhouseplanroom/daily/ and only prints the slug when that folder is three or more days old.","On 28 July the newest folder was 23 July. Five days. The portal was due."],cells:[{label:"In",paths:[{path:"Supabase portals.cadence_days",size:"the live cadence, edited from the PortalPro Matrix"},{path:"data/portals/registry.json",size:"offline fallback · cadence_days: 3, batch: portals"},{path:"data/planhouseplanroom/daily/",size:"39 dated folders on record"}],blocks:[],notes:[],tables:[]},{label:"The registry row for this portal, verbatim",paths:[],blocks:[`{
 "slug": "planhouseplanroom",
 "label": "PlanHouse PlanRoom",
 "engine": "",
 "batch": "portals",
 "cadence_days": 3,
 "authed": true,
 "enrich_passes": ["planhouse docs (planhouseplanroom)"],
 "watch": "none",
 "in_cumulative": true,
 "in_portalpro": true,
 "carry_forward": "orchestrator"
}`],notes:["engine is an empty string. This portal has no shared engine, it has four scripts of its own. That empty string surfaces later as a literal blank in the daily report header."],tables:[]}],notes:[],then:"the slug is printed as due, so a worker is handed the job"},{n:"1",title:"One worker owns the whole sweep",who:"Agent(general-purpose) → .claude/skills/planhouseplanroom-sweep/SKILL.md",summary:["The portal sits in Batch B of the nightly run. A single child agent reads the sweep instructions and drives every step from the pull to the archive. It reports back with a summary, but the summary is not trusted. What counts is the files it left on disk.","The sweep instructions carry one hard rule that shapes everything after it: never log in during the pull. The project list and every project page are public. The paid account is only for downloading plans, much later."],cells:[{label:"In",paths:[{path:".claude/skills/planhouseplanroom-sweep/SKILL.md",size:"145 lines, 7 phases"}],blocks:[],notes:[],tables:[]},{label:"Out",paths:[{path:"a child process running run_daily.py",size:"pull → prep → triage → judge → compile"}],blocks:[],notes:['The runbook disagrees with the instructions. data/planhouseplanroom/PORTAL.md line 38 says the pull "uses an LGS login". It does not. The puller is plain urllib with no cookie anywhere. PORTAL.md labels itself a draft on line 3, and this is one of the lines that never got audited.'],tables:[]}],notes:[],then:"nine pages of cards, then 83 project pages"},{n:"2",title:"Pull the list, then every project page",who:"data/planhouseplanroom/scripts/pull_bids.py",summary:["Ten cards per page until a page comes back empty. Then each project page is fetched, eight at a time, and the RFP body is kept. The whole thing took 14.6 seconds for the detail pass and every one of the 83 fetches worked.","One quiet piece of engineering holds this together: PlanHouse's server breaks on modern TLS handshakes, so the client is pinned to an older version on purpose. Without that pin the pull returns nothing at all."],cells:[{label:"In → Out",paths:[{path:"https://www.planhouseplanroom.com/projects/public?status=bidding",size:"9 pages of cards"},{path:"bids/all-bids.json",size:"292,804 bytes · 83 rows · 14 fields"},{path:"bids/index.json",size:"243 bytes"},{path:"logs/pull_bids_log.txt",size:"958 bytes"}],blocks:[`{
 "generated_at": "2026-07-28T19:02:40.257187+00:00",
 "source": "planhouseplanroom",
 "endpoint": "https://www.planhouseplanroom.com/
 projects/public?status=bidding",
 "snapshot_total": 83,
 "detail_ok": 83,
 "detail_failed": 0
}`],notes:[],tables:[]},{label:"Real record Bid A",paths:[],blocks:[`{
 "id": "20687",
 "slug": "2026906-west-jones-high-school-re-roof",
 "title": "2026906 West Jones High School Re-Roof",
 "owner": "PryorMorrow PC (Brandon)",
 "location": "Laurel, MS (H-NR-E)",
 "state": "MS",
 "bid_date": "8/25/26 2:00pm",
 "due_date_raw": "8/4/26 1:00pm",
 "due_date": "2026-08-04",
 "status": "Bids due in 28 days",
 "detail_url": "https://www.planhouseplanroom.com/
 projects/20687/details/2026906-west-jones-
 high-school-re-roof",
 "contact_text": "",
 "description": "5 jarellano@pryor-morrow.com
 Location Laurel, MS Sealed bids will be
 received in the Jones County School
 District's Front Desk, 5204 Highway 11
 North, Ellisville, Mississippi, until
 2:00 p.m. on Tuesday , August 25, 2026,
 for: 2026906 West Jones High School Roof
 Evaluation and Replacement…",
 "_detail_ok": true
}`],notes:[],tables:[]}],notes:[`Two field traps are born right here, and both survive to the board. First, contact_text is an empty string. Not on this bid. On all 83 rows. The contact block is fetched by a pattern that wants Company &amp; Contacts</h3> in the raw HTML; a second pattern in the same file finds "Company & Contacts" in the stripped text and uses it to locate the description, so the block is on the page. The capture simply does not match it. The contact then bleeds into the front of the description instead, which is why this record opens mid-phone-number with "5 jarellano@pryor-morrow.com". 62 of the 83 descriptions contain an email address. Second, owner is not the buyer. It is whoever posted the project. Sometimes that is the agency, often it is the design firm. Here it is PryorMorrow PC; the real buyer is Jones County School District, named only inside the description text. Of the ten most frequent owners in tonight's stats file, seven are engineering or architecture firms and three are real buyers. That one ambiguous field is the root of every buyer problem on this page.`],then:"today's ids are compared against the last archive"},{n:"3",title:"Split the snapshot into old news and new work",who:"data/planhouseplanroom/scripts/prep_bids.py",summary:["The 83 project ids are matched against the newest previous archive, which was 23 July with 82 ids in it. 65 matched and keep their old decision without costing anything. 18 did not match and go to the triage agent.","Every bid, old and new, also gets a fat text block ready for the judge, so nothing has to be re-fetched later."],cells:[{label:"In → Out",paths:[{path:"bids/all-bids.json",size:"83 rows"},{path:"daily/2026-07-23/triage.json",size:"82 prior ids"},{path:"runs/triage-input.json",size:"4,729 bytes · 18 rows"},{path:"runs/triage-carryover.json",size:"9,206 bytes · 65 rows"},{path:"runs/judge-input.json",size:"300,888 bytes · 83 rows"},{path:"runs/_funnel.json",size:"153 bytes"}],blocks:[`{
 "date": "2026-07-28",
 "snapshot_total": 83,
 "carryover_count": 65,
 "triage_input_count": 18,
 "prior_archive_ids_compared_against": 82
}`],notes:[],tables:[]},{label:"Real records, triage-input.json Bid ABid B",paths:[],blocks:[`{
 "idx": 6,
 "bid_id": "20687",
 "title": "2026906 West Jones High School Re-Roof",
 "owner": "PryorMorrow PC (Brandon)",
 "state": "MS",
 "location": "Laurel, MS (H-NR-E)",
 "bid_date": "8/25/26 2:00pm"
}`,`{
 "idx": 5,
 "bid_id": "20688",
 "title": "2024-458-00 Town of Georgetown -
 2024 CDBG Drainage Improvements",
 "owner": "WGK Engineers, Inc",
 "state": "MS",
 "location": "Town of Georgetown, MS (T-NR)",
 "bid_date": "8/13/26 10:00am"
}`],notes:["Seven fields, no description. The triage agent decides from the title, the posting firm and the state. Note the owner again: WGK Engineers is the engineer. The buyer is the Town of Georgetown, and it only appears inside the title by luck."],tables:[]}],notes:["idx is not a row number and cannot be joined on. In runs/triage-carryover.json the value 0 appears 14 times, 1 appears 11 times, and two of the 65 rows have no idx at all. Only 10 of the 65 carry a title. The carryover file is a stack of fragments copied from many different past nights, each keeping the position it held in its own batch."],then:"18 titles go to the AI, and the AI says no to every one"},{n:"4",title:"Triage, and the override that reopened five bids",who:"max-triage · AI, then a harness override",summary:["The triage agent reads title, firm and state and answers OPEN or SKIP. The default is SKIP. On 28 July it produced 18 SKIPs and zero OPENs. The board that night was re-roofs, paving, culverts, a courthouse renovation and a police station. None of it is LGS work.","Then something else stepped in. Five of the 18 were reopened by the harness, not by the agent, because the RFP body contained a word the title did not. Each override wrote down the exact word that triggered it."],cells:[{label:"Out",paths:[{path:"runs/triage-verdicts.json",size:"3,152 bytes · 18 rows · 13 SKIP, 5 OPEN"}],blocks:[`{
 "idx": 6,
 "bid_id": "20687",
 "decision": "SKIP",
 "reason": "school re-roof, construction"
}`,`20696 "grubbing"
20694 "creek"
20691 "drainage"
20688 "cleaning and grading of the existing
 ditch system"
20680 "dredging of a pond / grading of ditches"`],notes:["Bid A's journey ends here. One page fetch and one title read is its entire cost."],tables:[]},{label:"Real record Bid B · reopened",paths:[],blocks:[`{
 "idx": 5,
 "bid_id": "20688",
 "decision": "OPEN",
 "reason": "ESCALATED by harness: title carries
 no LGS verb but RFP body does
 (\\"cleaning and grading of the existing
 ditch system\\") - sent to Pass 2",
 "_escalated_by_harness": true,
 "_escalation_evidence": "cleaning and grading of the
 existing ditch system"
}`],notes:["This override is written down nowhere. A search across every Python file and every Markdown file in the repo and in the skills folder returns no match for _escalated_by_harness or _escalation_evidence outside the data files themselves. The portal's own sweep instructions never mention it. Its seven documented phases describe an agent that decides and a harness that saves the answer, and that is not what happened."],tables:[]}],notes:["The night's real result, in one line: the AI gate said SKIP to all 18, a body-text override sent five back for a second look, and the judge then agreed with the AI on every single one. The override cost five deep reads and changed no outcome. It is still the right kind of safety net, and this run is the evidence for what it costs when it fires."],then:"the fat text blocks are filtered down to just those five"},{n:"5",title:"Keep only the reopened bids",who:"an inline snippet inside the sweep instructions, no script in the repo",summary:["Six lines of Python that live inside the instruction file, not in any file under scripts/. They keep the rows of judge-input.json whose id came back OPEN, and write those out. If there are no OPENs this step is skipped entirely."],cells:[{label:"In → Out",paths:[{path:"runs/judge-input.json",size:"300,888 bytes · 83 rows"},{path:"runs/triage-verdicts.json",size:"the 5 OPEN ids"},{path:"runs/judge-input-open.json",size:"20,408 bytes · 5 rows"}],blocks:[`idx 0 20696
idx 2 20694
idx 3 20691
idx 5 20688
idx 11 20680`],notes:["Those idx values are positions in the 18-row triage input, carried along unchanged. Nothing renumbers them."],tables:[]},{label:"Real record Bid B · the judge's whole input",paths:[],blocks:[`{
 "idx": 5,
 "bid_id": "20688",
 "title": "2024-458-00 Town of Georgetown -
 2024 CDBG Drainage Improvements",
 "owner": "WGK Engineers, Inc",
 "state": "MS",
 "bid_date": "8/13/26 10:00am",
 "detail_url": "https://www.planhouseplanroom.com/
 projects/20688/details/2024-458-00-town-of-
 georgetown-2024-cdbg-drainage-improvements",
 "description_full": "Title: 2024-458-00 Town of
 Georgetown - 2024 CDBG Drainage Improvements
 Owner / buyer: WGK Engineers, Inc
 Location: Town of Georgetown, MS (T-NR)
 State: MS
 Bid date: 8/13/26 10:00am
 Source URL: https://www.planhouseplanroom…

 Contact:

 RFP body (truncated to 5KB):
 eers.com Location Town of Georgetown, MS
 COMING SOON! NOTICE is hereby given that
 the Town of Georgetown, Mississippi, will
 receive written sealed bids until the hour
 of 10:00 am local time on Thursday,
 July 30, 2026…"
}`],notes:[`Look at the line that says Contact: with nothing after it, and at the body starting "eers.com". The contact was never captured; the tail of the engineer's email address is the first thing the judge reads.`],tables:[]}],notes:[],then:"five full RFP bodies get scored"},{n:"6",title:"The judge, and five NOs",who:"max-bid-judge · AI",summary:["Each of the five gets a yes, maybe or no, a score out of 100, a category and written reasoning. The results: 8, 5, 5, 28 and 25. Not one crossed into maybe. The best of the night was Bid B at 28.",`The judge's reasoning on Bid B is worth reading because it explains the override exactly: the word "cleaning" is the same word LGS's disaster-debris wins use, but the job underneath it is regrading ditches and swapping culverts.`],cells:[{label:"Out",paths:[{path:"runs/judge-verdicts.json",size:"6,699 bytes · 5 rows · 16 fields each"}],blocks:[`20696 no 8 Multi-modal Railroad Siding Extension
20694 no 5 1-10149-24P SABP-41(01)
20691 no 5 Shaw Sidewalk Improvements
20688 no 28 Georgetown CDBG Drainage Improvements
20680 no 25 Pond 6 Remediation at Pine Golf Course`],notes:['The same project, two brands, two different answers. PlanHouse runs a second storefront called phbidding over the same database, and it is swept separately. On this same night, data/phbidding/daily/2026-07-28/verdicts.json holds bid 20688 as "would_lgs_bid": "maybe" with "score": 52. Same RFP body, same date, one portal says NO at 28 and the other says MAYBE at 52. Two runs of the same judge on the same text.'],tables:[]},{label:"Real record Bid B · NO, 28",paths:[],blocks:[`{
 "bid_id": "20688",
 "title": "2024-458-00 Town of Georgetown -
 2024 CDBG Drainage Improvements",
 "would_lgs_bid": "no",
 "verdict": "no",
 "score": 28,
 "lgs_score": 28,
 "category": "construction / civil drainage",
 "primary_reason": "The scope is 'cleaning and grading
 of the existing ditch system' plus replacing
 driveway and roadway culverts to match the
 newly designed ditch grade — a CDBG-funded,
 bonded, 120-day civil-construction contract
 engineered by WGK, not a debris or vegetation
 clearing job. The 'cleaning' surfaces the same
 word LGS's disaster-debris wins use, but the
 actual deliverable is regraded ditch profiles
 and new culvert installs…",
 "service_match": "none",
 "scale_match": "below_floor",
 "buyer_match": "none",
 "red_flags": [
 "resembles_debris_language_but_is_
 engineered_civil_grading",
 "culvert_installation_beyond_lgs_scope",
 "low_scale_inferred_single_site"
 ],
 "fit_signals": [
 "ditch_cleaning_language_adjacent_to_
 drainage_clearing"
 ],
 "kansas_city_risk": true,
 "closed_award": false,
 "elaboration": "…Escalation was reasonable given the
 'cleaning' trigger, but the body reads as a
 small civil letting. Pass, though worth a
 second look only if LGS ever wants to sub the
 ditch-cleaning piece under a general civil
 contractor."
}`],notes:[],tables:[]}],notes:[`The record contradicts its own due date, and the roll-up knows it. The snapshot has due_date: "2026-08-13". The description in the very same record says bids are received "until the hour of 10:00 am local time on Thursday, July 30, 2026". The cross-portal roll-up for this night flags the same bid by hand: | 07-30 | phbidding 20688 Georgetown MS ditch cleaning | 52 | **list says 08-13 — wrong** |. The page's Bid Date field is not reliable on this portal.`],then:"old decisions and new ones are merged into one day folder"},{n:"7",title:"Write the archive",who:"data/planhouseplanroom/scripts/compile_insights.py",summary:["The 65 carried decisions and the 18 fresh ones are stitched into a single 83-row triage file, the counts are totted up, and the day folder is written. A row is also added to the archive index.","This is the snapshot of the night before anything cross-portal touches it. It is also the moment the numbers on this page start to diverge from the numbers in the report."],cells:[{label:"Out · data/planhouseplanroom/daily/2026-07-28/",paths:[],blocks:[],notes:["new-bids.json is not the day's new bids. It is the whole snapshot, all 83 rows, identical to bids/all-bids.json. The name is a convention shared across every portal and it misleads on every one of them."],tables:[[{header:!0,cells:["File","Holds","Size"]},{header:!1,cells:["new-bids.json","83 rows, byte-for-byte the full snapshot","292,804 B"]},{header:!1,cells:["triage.json","83 decisions, 76 SKIP and 7 OPEN","12,355 B"]},{header:!1,cells:["verdicts.json","5 rows at this point, all NO","15,032 B later"]},{header:!1,cells:["stats.json","the funnel counts","933 B"]},{header:!1,cells:["report.md","the human summary","2,232 B"]}]]},{label:"stats.json, the counting part",paths:[],blocks:[`{
 "snapshot_total": 83,
 "carryover_count": 65,
 "new_to_triage": 18,
 "triage": {"open": 7, "skip": 76, "total": 83},
 "scoring": {"yes": 0, "maybe": 0, "no": 5, "total": 5},
 "by_state": {"MS": 76, "(unknown)": 5, "AL": 2},
 "verdicts_unresolved": 0,
 "generated_at": "2026-07-28T19:09:29.863074+00:00"
}`],notes:['The "top owners" list is a list of engineering firms. The same file ranks "Cook Coggin Engineers": 8, "Willis Engineering": 4, "MP Design Group": 3. Read as buyers they are wrong. They are the firms that uploaded the plans. Only three entries in that top ten are actual buyers.'],tables:[]}],notes:["The index row is written now and never revisited. daily/INDEX.md gained the line | 2026-07-28 | 83 | 18 | 7 | 0 | report |. That zero is the YES count as it stood at 19:09. The next stage changes the YES count and does not go back to fix this row."],then:"the portal's own work is done, the shared machinery takes over"},{n:"8",title:"Carry forward: this portal is in it",who:"2.5 · scripts/carry_forward_verdicts.py --all",summary:[`The registry says carry_forward: "orchestrator". In plain words: this portal's verdicts are merged by the shared nightly script, from outside. Its twin phbidding says engine-internal, meaning the merge already happened inside its own engine and the shared script deliberately leaves it alone so the same verdicts are not applied twice.`,"So for PlanHouse the script runs. It takes the still-live verdicts from 23 July, drops anything already re-judged tonight or older than 90 days, and merges the rest into tonight's file. Five NOs became eleven verdicts."],cells:[{label:"Out",paths:[{path:"daily/2026-07-28/verdicts.json",size:"15,032 bytes · 11 rows"},{path:"daily/2026-07-28/_carryforward_audit.json",size:"429 bytes"}],blocks:[`{
 "portal": "planhouseplanroom",
 "ok": true,
 "skipped": false,
 "today": "2026-07-28",
 "prior_date_used": "2026-07-23",
 "today_new_judged": 5,
 "carried_forward": 6,
 "carried_forward_not_in_today_snapshot": 5,
 "dropped_too_old": 0,
 "dropped_already_judged_today": 0,
 "dropped_closed_award": 0,
 "final_total": 11,
 "final_yes": 2,
 "final_maybe": 2,
 "final_no": 7,
 "max_age_days": 90
}`],notes:[],tables:[]},{label:"Real record · one of the two YES rows this portal shows that day carried from 10 July",paths:[],blocks:[`{
 "bid_id": "20625",
 "would_lgs_bid": "yes",
 "score": 82,
 "category": "Cat 2 - Utility ROW / Vegetation
 Management",
 "primary_reason": "Core ROW + vegetation management
 RFP for a municipal buyer (City of Jackson)
 at citywide scope; clears the scale floor.
 Bundled residential-lots mowing/clearing is
 compatible adjacent scope, not a
 disqualifier.",
 "red_flags": [
 "residential_lots_scope_needs_packet_review",
 "no_stated_dollar_value",
 "mandatory_pre_bid_meeting_7_14_26"
 ],
 "_first_judged": "2026-07-10",
 "_carryforward_from": "2026-07-23",
 "_in_today_snapshot": false,
 "verdict": "yes"
}`],notes:[`That last stamp is wrong. _in_today_snapshot: false says the bid fell out of tonight's pull. It did not. Project 20625 is row-for-row present in both bids/all-bids.json and daily/2026-07-28/new-bids.json, with status "Bids due today at 3:30pm". An operator reading that flag would think the solicitation had closed.`],tables:[]}],notes:["This is where two files about the same day start telling different stories. stats.json was written at 19:09 and says yes 0, maybe 0, no 5. The verdicts file after carry-forward holds yes 2, maybe 2, no 7. Nothing goes back and rewrites stats.json or the INDEX.md row. Anything reading the stats file sees a night with zero YES; anything reading the verdicts file sees two. Both of those two are carried, not judged tonight: 20625 at 82, first judged 10 July, and 20470 at 72, first judged 14 June. Neither was scored on 28 July."],then:"the merged verdicts feed the ledger, the report and the board file"},{n:"9",title:"The ledger, the report, the board file",who:"2.6 portals_cumulative.py · 2.7 standardize_daily_reports.py · 2.8 dump_yes_for_portalpro.py",summary:["Three shared steps read the merged verdicts. The all-time YES ledger walks every day folder of every registered portal. The report renderer throws away this portal's own layout and rebuilds it so every portal reads the same. The board dump flattens every bid ever judged YES into one record each.","The rebuilt report is timestamped 22:37, more than three hours after stats.json, which is why it shows the post-carry-forward count."],cells:[{label:"Out",paths:[{path:"data/portals/cumulative-yes.json + .md",size:"all portals, all time"},{path:"daily/2026-07-28/report.md",size:"2,232 bytes, rewritten in place"},{path:"PortalPro/src/fixtures/portal-bids.json",size:"7 planhouseplanroom cards"}],blocks:[`- Snapshot: **83** open bids
- Carryover: 65 · NEW today: 18
- Triage: 7 OPEN / 76 SKIP
- Scored: **2 YES / 2 MAYBE / 7 NO**`],notes:[],tables:[]},{label:"Two visible defects in the shipped report",paths:[],blocks:[`**Source:** … · engine \`\` · state MS

- **[72] 20470** — — · closes unknown
 MS site-development grant with 'Phase I Site
 Development' in title; matches LGS historical
 win shape…`],notes:['The renderer prints a real buyer, by luck. For bid 20625 it shows "City of Jackson", because it falls back to the owner field and for this one bid the city posted its own project rather than going through an engineer. The board file, built by a different script from the same data, shows something else. That difference is the next stage.',"The header prints engine `` because the registry field is an empty string. And the second YES has no title, no buyer and no closing date, because it is a carried verdict for a bid that is not in tonight's snapshot, so there is no snapshot row to read those from. The bid id is printed where the title should be, and the two dashes are the empty title and empty buyer."],tables:[]}],notes:[],then:"the portal stops being its own board"},{n:"10",title:"Onto the shared board, and the twin that will not merge",who:"2.85 · publish_to_supabase.py → llm_dedup_candidates.py → bid-dedup-judge → apply_llm_dedup.py",summary:["Every YES row is pushed into one shared table. Bids with the same cleaned-up title and state, and compatible buyer and closing date, are grouped into one cluster so a solicitation seen on two portals shows up once.","PlanHouse has a problem no other portal has. It is the same plan room as phbidding, brand for brand, and the overlap file counts 82 shared titles between them. The two are swept separately, judged separately, and land on the board separately."],cells:[{label:"The board card as it exists now 20625 · planhouseplanroom",paths:[],blocks:[`{
 "id": "688f61161eda650f",
 "portal": "planhouseplanroom",
 "source_bid_id": "20625",
 "title": "96866-072826 Residential Lots,
 Right-of-Way, and Vegetation Management
 Services",
 "buyer": "Jackson, MS (T-NR-E)",
 "state": "MS",
 "score": 82,
 "verdict": "yes",
 "due_date": "2026-07-23",
 "contact_name": null,
 "contact_email": null,
 "contact_phone": null,
 "first_seen": "2026-07-10",
 "last_seen": "2026-07-28",
 "has_documents": true
}`],notes:[],tables:[]},{label:"The same project, the other brand 20625 · phbidding",paths:[],blocks:[`{
 "id": "9dd276f4199a8237",
 "portal": "phbidding",
 "source_bid_id": "20625",
 "title": "96866-072826 Residential Lots,
 Right-of-Way, and Vegetation Management
 Services",
 "buyer": "City of Jackson",
 "state": "MS",
 "score": 70,
 "verdict": "yes",
 "category": "row-vegetation-management"
}`],notes:["Identical title. Identical project id. Different buyer, different score, two cards. The dedup rule refuses to merge two bids whose closing dates disagree, and these two disagree."],tables:[]}],notes:[`The stale-model correction, and which date is actually right. The model doc docs/portal-dataflow/planhouseplanroom.md lists it as a known wall that "every planhouseplanroom bid reaches Supabase with buyer=''". The live file disagrees: all 7 cards now carry a buyer. What they carry is the location string with the plan room's own grade codes attached, like "Jackson, MS (T-NR-E)" and "Grenada Co., MS (T-NR-E)". It is a place, not an agency. The model is stale; the field is filled but filled with the wrong thing. On the date: the model doc left it as an open question which of the two closing dates was correct. The RFP body in our own snapshot settles it. It says proposals are due "July 28, 2026, at 3:30 PM Central Time" and that the mandatory pre-bid meeting is "July 23, 2026 at 10:00 am". Our due_date of 2026-07-23 is the pre-bid meeting. The phbidding value of 2026-07-28 is the real deadline. This portal's card has the wrong date, and it is the wrong date that keeps the two cards apart.`],then:"this is where the paid account would be used, and where the night stopped"},{n:"11",title:"The one logged-in pass, and it did not run",who:"2.85 enrichment · open folders/_lib/planhouse_doc_capture.py · DEFERRED on 28 July",summary:["This is the only stage that uses the paid account. For each YES or MAYBE bid it opens the addenda page and downloads the files, then does something unusual for the plans: there is no download button and the direct file route is blocked at this account tier, so it drives the site's own viewer and renders every page of the spec set into one PDF. It runs one login at a time and checks what is already stored before paying for a render.","On the night of 28 July this stage was skipped on purpose. The operator stopped the run rather than open more logged-in sessions unattended at the end of a long night. Everything from here to the end of the page is a stage the pipeline describes and this run did not perform."],cells:[{label:"What it would have read and written",paths:[{path:"data/auth/planhouseplanroom-creds.txt",size:"present, 18 bytes"},{path:"/projects/{id}/addenda/{slug} and /projects/{id}/specs/{slug}",size:null},{path:"storage bid-docs/{cluster_id}/documents/{ts}-{name}",size:null},{path:"table bid_documents",size:"uploaded_by: planhouseplanroom-auto"}],blocks:[],notes:["Three ways this pass gives up, all silent to the day folder. No credentials and it prints and returns. A viewer page that hangs for 90 seconds and the whole bid is skipped. A file over 45MB and it is skipped. None of those write anything into data/planhouseplanroom/, so a night where the documents failed looks exactly like a night where they succeeded. That is also why a deferred night leaves no mark in this portal's folder."],tables:[]},{label:"The roll-up's own words, from data/portals/daily/2026-07-28/roll-up.md",paths:[],blocks:[`## Phases DEFERRED — and why

- **\`run_enrichment_phase.py\` (2.85 tail)** — ~1 h
 and it authenticates to bidnet/ionwave/
 bonfire-pro/planhouse. bidexpress, bidprime,
 bonfire-pro and demandstar-pro **already logged
 in today**. Deferred as an operator decision
 rather than stacking more authed sessions
 unattended at the end of a long run.`],notes:[`"planhouse" in that list is this portal. The board cards still show "has_documents": true because the documents were captured on earlier runs, and PORTAL.md's health snapshot of 14 July records 100% document coverage. Nothing new was fetched on 28 July.`],tables:[]}],notes:[],then:"the requirements chain waits on the documents, so it waited too"},{n:"12",title:"Requirements, then a second try at the twin",who:"2.87 extract_doc_text.py → requirements-extractor · 2.875 llm_dedup_candidates.py · DEFERRED on 28 July",summary:["The text is pulled out of every new document, a pack is built per cluster, and an agent reads the pack and writes down what the bid demands, each with a quote from the source. Clusters with no material get a neutral row so nothing sits looking unfinished forever.","For this portal that step matters more than for most, because it is the second chance at the fields the pull never got. The backfill only fills what is empty, and on PlanHouse the contact fields are always empty.","Then dedup runs again. Enrichment may have corrected a closing date, and a corrected closing date is exactly what the PlanHouse and phbidding pair needs to finally collapse into one card."],cells:[{label:"Also deferred, and the roll-up says so plainly",paths:[],blocks:[`- **2.87 requirements** (extract_doc_text →
 build_bidpack → requirements-extractor →
 apply_requirements → publish_doc_gaps) — skill
 marks it UNSKIPPABLE and the sentinel is
 correctly RED on it. Deferred only because it
 follows the enrichment phase.
- **2.875 dedup re-pass, 2.89 bid packs,
 2.9/2.95/2.96 monitor/overview/goal-state.**`],notes:["Nothing at this stage is per-portal. There is no file under data/planhouseplanroom/ that records whether requirements ran. To find out whether a PlanHouse cluster got its requirements you have to query the shared board, not read this portal's folder. That is precisely why a whole deferred tail leaves the portal's own archive looking complete.","The file timestamps agree. data/portals/llm-dedup-candidates.json was last written at 17:41 on 28 July, before this portal's own pull started at 19:02, so it does not contain this night's work. data/portals/requirements-manifest.json was next written on 29 July, the day after."],tables:[]}],notes:[],then:"what changed, who needs telling, did the run finish"},{n:"13",title:"Watch, mail, sentinel",who:"2.88 · bid_watch.py · new_bids_email.py · alerts_engine.py · pipeline_sentinel.py",summary:["Three things happen at the end, and for this portal two of them do very little.",`This card sits between two deferred ones because the sentinel is the one late step that did run. The roll-up's "Phases run" line names it: 2.88 sentinel. The watch and the emails are not deferred, they are switched off.`],cells:[{label:null,paths:[],blocks:[],notes:[`Green with zero contacts captured. The sentinel raises thin-capture warnings on other portals in that same file, for example "thin capture: contact 5% docs 9%" against NAPC. It raises nothing here, even though this portal's own puller captured empty contact_text on all 83 rows. The sentinel is measuring the board after every cross-portal backstop has run, not what the portal itself brought home. Both readings are true; only one of them tells you the puller is broken. Note also that the portal row is green while the sentinel's own system-wide requirements check was red that night, which is what the roll-up meant by "the sentinel is correctly RED on it". A green portal row does not mean the portal's night finished.`],tables:[[{header:!0,cells:["Step","What it does for PlanHouse"]},{header:!1,cells:["Watch for changes on tracked bids",'Off. The registry says watch: "none". Seven other portals do have change-detection wired — four on v2-recipe (bidnet, centralauctionhouse, demandstar-pro, bonfire-pro) and three on v1-pagetext (demandstar, bidexpress, ionwave). The other 40 are off, like this one.']},{header:!1,cells:["Email digests","Silent. data/auth/resend.env does not exist on disk, so every send is a no-op."]},{header:!1,cells:["Sentinel run check",'Ran. The file now on disk was rewritten on 30 July, and its row for this portal reads {"slug": "planhouseplanroom", "batch": "portals", "status": "GREEN", "issues": [], "last_archive": "2026-07-28", "surfaced": 7}.']}]]}],notes:[],then:"the last boards, and where a person finally sees it"},{n:"14",title:"Packs, boards, and the roll-up that never names this portal",who:"2.89 build_bidpack.py · 2.9 build_portal_metrics.py · DEFERRED · 4.99 scorecard.py · ran",summary:["Each cluster becomes a folder of plain text a person can read: the bid summary, the page text, the requirements, and the full words of every document. The monitor board counts bids per portal per day, and the overlap sheet counts how many titles any two portals share. That overlap sheet is the only place the twin problem is visible on its own.","The packs and the boards were deferred with the rest of the tail. The scorecard did run. So the overlap number below is real, but it is from four nights earlier."],cells:[{label:"The overlap record, verbatim",paths:[],blocks:[`{
 "a": "phbidding",
 "b": "planhouseplanroom",
 "shared": 82
}`],notes:['Second-largest overlap in the whole system, out of every pair of portals. Only DemandStar and IonWave share more. Every one of those 82 is the same project seen twice. The file stamps itself "generated_at": "2026-07-24T22:32:19+00:00", so it predates this run.'],tables:[]},{label:"Where the trail stops",paths:[],blocks:[],notes:["The roll-up script scripts/portals_rollup.py works off a hardcoded list of six portals: bidnet, demandstar, ms-dfa, myvendorlink, napc, centralauctionhouse. planhouseplanroom is not one of them. The model doc lists that script as a reader of this portal's stats file; on the code as it stands, it is not.",`The night's roll-up at data/portals/daily/2026-07-28/roll-up.md matches. The slug planhouseplanroom appears nowhere in it. The word "planhouse" appears once, in the list of portals whose logged-in pass was skipped. Its twin phbidding is named in the deadline table. A reader of that roll-up would not learn that this portal ran, or what it found.`],tables:[]}],notes:["Where a person finally sees a PlanHouse bid: the live PortalPro board. Seven cards, all YES, all Mississippi. Five of them are the City of Jackson creek and channel clearing lots COJ-CC-01 through COJ-CC-05, scored 70 to 72 on the very first run in May. One is the Jackson right-of-way and vegetation job at 82. One is a Grenada County site development grant at 72. Not one of the seven was judged on 28 July."],then:null}],d=[{heading:"The quirks that bite",tables:[[{header:!0,cells:["Quirk","Consequence"]},{header:!1,cells:["The whole tail of the run was deferred on 28 July","the logged-in document pass, the requirements chain, the second dedup, the packs and the boards all skipped by operator decision at the end of a long night. The portal's own day folder looks complete either way, because none of those stages write anything into it."]},{header:!1,cells:["owner is the engineering or architecture firm, not the buyer",`every downstream buyer field is wrong at the source. The stats file's "top owners" ranks Cook Coggin Engineers and Willis Engineering as if they were agencies. The real buyer is named only inside the description text.`]},{header:!1,cells:["contact_text came back empty on all 83 rows","the judge's input literally reads Contact: with nothing after it. The contact block's text lands at the head of the description instead: 62 of the 83 descriptions carry an email address somewhere, and on 48 of them it sits in the first 200 characters, so the body opens mid-contact. The board's three contact fields are all null."]},{header:!1,cells:['The model doc says buyer lands as "". It no longer does.','the model is stale. The live board file carries a buyer on all 7 cards, but the value is the location plus plan-room grade codes, like "Jackson, MS (T-NR-E)". A place, not an agency.']},{header:!1,cells:["The page's Bid Date is not the deadline",`bid 20625 has due_date 2026-07-23, which the RFP body shows is the mandatory pre-bid meeting; the real deadline is 28 July. Bid 20688 has 2026-08-13 while its own description says 30 July, and the night's roll-up flags that by hand as "wrong".`]},{header:!1,cells:["Same plan room, two brands, swept twice","82 shared titles with phbidding. On 28 July the identical bid 20688 was judged NO at 28 here and MAYBE at 52 there. The dedup rule will not merge two cards whose closing dates disagree, and this portal's dates are the unreliable ones."]},{header:!1,cells:["Five OPENs came from an override, not from triage","the AI said SKIP on all 18. _escalated_by_harness appears in no script and no instruction file anywhere in the repo, only in the data. All five overrides were judged NO."]},{header:!1,cells:["stats.json and report.md disagree about the same day","0 YES versus 2 YES. The stats file and the archive index row are frozen before carry-forward; the report is rebuilt after it. Neither is corrected."]},{header:!1,cells:["_in_today_snapshot: false on a bid that is in today's snapshot",'bid 20625 is present in all-bids.json and new-bids.json with status "Bids due today at 3:30pm", yet the stamp says it fell out.']},{header:!1,cells:["A carried verdict with no snapshot row loses its title",'the shipped report prints **[72] 20470** with the bid id where the title should be, a blank buyer and "closes unknown".']},{header:!1,cells:["idx is not unique and is sometimes absent","value 0 appears 14 times in the 65-row carryover file, two rows have no idx at all, and only 10 of 65 carry a title. Any join on idx is broken."]},{header:!1,cells:["new-bids.json is the whole snapshot, not the new bids","83 rows, byte-for-byte identical to bids/all-bids.json. A shared naming convention that misleads on every portal."]},{header:!1,cells:["Registry engine is an empty string","the daily report header prints engine `` literally. Harmless, and it has been shipping for weeks."]},{header:!1,cells:["PORTAL.md says the pull logs in. It does not.","the puller is plain HTTP with no cookie, and the sweep instructions make no-login a hard rule. The authed: true flag describes the document pass only. PORTAL.md marks itself a draft."]},{header:!1,cells:["The plans have no download link and the file route is blocked","worked around by driving the site's own viewer and rendering every page into one PDF. 130-page spec sets are normal; a page that hangs for 90 seconds skips the whole bid, silently."]},{header:!1,cells:["portals_rollup.py covers six hardcoded portals and this is not one","the model doc lists it as a consumer of this portal's stats file. The night's roll-up names phbidding and never names planhouseplanroom."]},{header:!1,cells:["The server breaks modern TLS handshakes","the client is pinned to an older version on purpose. Remove that pin and the pull returns nothing."]},{header:!1,cells:["prep_bids.py only picks the right prior folder when the run is pinned","on 28 July it still used a bare date.today(); the shared rundate helper landed the next day (commit 55cf1dd6, 29 July) and the file now imports it. So a pinned run (LGS_TODAY) is one coherent day. Unpinned, this script falls back to the machine's local day while portal_due and pipeline_sentinel fall back to UTC — both fallbacks kept on purpose — so an unpinned run crossing midnight can still compare against a different day's folder than the rest of the pipeline."]}]],paragraphs:["Generated 5 August 2026 by /portal-stages-visualise from the run of 28 July 2026. Every record above was read off disk from the file named beside it; every count traces to daily/2026-07-28/stats.json, a row count, or a byte size. No record on this page was written by hand. Baseline map: docs/portal-dataflow/planhouseplanroom.md, evidence-cited to file and line, and stale in the four places named above. Facts file: docs/portal-dataflow/pedia-inspect/planhouseplanroom.json."]}],h="Generated 5 August 2026 by /portal-stages-visualise from the run of 28 July 2026. Every record above was read off disk from the file named beside it; every count traces to daily/2026-07-28/stats.json, a row count, or a byte size. No record on this page was written by hand. Baseline map: docs/portal-dataflow/planhouseplanroom.md, evidence-cited to file and line, and stale in the four places named above. Facts file: docs/portal-dataflow/pedia-inspect/planhouseplanroom.json.",c="docs/portal-dataflow/pedia-planhouseplanroom.html",p={slug:e,title:t,eyebrow:a,headline:n,lede:s,funnel:o,funnel_note:r,legend:i,stages:l,sections:d,footer:h,source_page:c};export{p as default,a as eyebrow,h as footer,o as funnel,r as funnel_note,n as headline,s as lede,i as legend,d as sections,e as slug,c as source_page,l as stages,t as title};

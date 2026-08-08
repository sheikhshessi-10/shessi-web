const e="caleprocure",t="Cal eProcure — what happens to a bid, stage by stage",a="Portal pedia · 11",s="Cal eProcure: what happens to a bid, from a visible browser window to the board",n="California's statewide bid board. A wall on the site blocks silent browsers, so this portal is read by a real Chromium window opening on the operator's own machine. Every stage below is shown with a real record from the actual files. Two bids are followed the whole way. All data is from the run of 28 July 2026.",r=[{value:"300",label:"in snapshot"},{value:"259",label:"carried over"},{value:"41",label:"new to triage"},{value:"15",label:"open · all 300"},{value:"5",label:"yes · all 300"},{value:"0",label:"maybe"}],o="Source: data/caleprocure/daily/2026-07-28/stats.json (485 bytes). Read those last three cells carefully. The 15 OPEN, 5 YES and 10 NO describe the whole 300-bid snapshot, not tonight's work. Tonight only 4 of the 41 new bids were marked OPEN (runs/triage-verdicts.json, 41 rows) and only 4 bids were judged at all (runs/judge-verdicts.json, 4 rows) — one YES, three NO. The other 11 verdicts, including 4 of the 5 YES, were carried forward from earlier days. The 285 SKIPs cost nothing beyond a title read.",i=["Bid A · 26-10330 — Mass Printing and Mass Mailing, Dept of Public Health. SKIP — but decided on an earlier day, so it never reaches the AI tonight.","Bid B · 10A2942 — Caltrans tree trimming across eight counties. New tonight. Ends as YES, score 85."],l=[{n:"1",title:"Is this portal due today?",who:"scripts/portal_due.py --batch portals",summary:["The gate looks at the newest dated folder under data/caleprocure/daily/. Cadence is one day, so the portal is due whenever today's folder is missing. Nothing below this line runs if it is not due.","The registry row also decides two things that matter later: this portal carries its own verdicts forward (engine-internal), and it has one enrichment pass of its own."],cells:[{label:"In → Out",paths:[{path:"data/portals/registry.json",size:"the portal list"},{path:"data/caleprocure/daily/",size:"33 dated folders on disk"},{path:"printed list of due slugs",size:"no file written"}],blocks:[],notes:[`The gap nobody flags. Cadence says every day, but the archive folder before 28 July is 24 July. There are no folders for 25, 26 or 27 July. Whether the sweep started and failed on those days or never started at all is not answerable from the files. What is certain is the effect: the diff at stage 4 compared tonight against a four-day-old list, so "41 new" is four days of new bids, not one night's.`],tables:[]},{label:"Real record · this portal's registry row",paths:[],blocks:[`{
 "slug": "caleprocure",
 "label": "Cal eProcure — California State
 Contracts Register",
 "engine": "caleprocure",
 "batch": "portals",
 "cadence_days": 1,
 "authed": false,
 "enrich_passes": ["caleprocure docs"],
 "watch": "none",
 "in_cumulative": true,
 "in_portalpro": true,
 "carry_forward": "engine-internal"
}`],notes:[],tables:[]}],notes:[],then:"the roll-up hands the portal to a child agent"},{n:"2",title:"The orchestrator sends a child",who:"Agent(general-purpose) reading .claude/skills/caleprocure-sweep/SKILL.md",summary:["caleprocure sits in Batch G of the nightly run. One child agent per portal, five at a time, and the batch has to finish before the next one starts. If this child errors the roll-up marks the portal failed and the other portals keep going."],cells:[{label:"In → Out",paths:[{path:".claude/skills/caleprocure-sweep/SKILL.md",size:"the phase list"},{path:"a running child agent",size:"no file"}],blocks:[],notes:["This portal takes over the screen. The heavy-pull rule does not name caleprocure, but its pull opens a real browser window on the operator's desktop. It competes for that one desktop with every other window-driving pass in the same batch."],tables:[]}],notes:[],then:"a visible Chromium opens and clicks Search"},{n:"3",title:"Pull — read the whole open grid",who:"data/caleprocure/scripts/run_daily.py → engines/caleprocure.py (pull)",summary:["A real, non-hidden Chromium is parked off-screen, opens the event search page, clicks Go with no filters, waits for the grid to fill, and reads every row. Then it drops duplicates by event id and anything past its close date.","Hidden browsers get a 403 here. That is why the window is real, and why this portal cannot run unattended on a server the way an API portal can.","The grid gives five things: event id, event name, department, close date, status. No scope, no contact, no files. And every row's link is the search page, because this system has no working per-event address you can just open cold."],cells:[{label:"In → Out",paths:[{path:"caleprocure.ca.gov/pages/Events-BS3/event-search.aspx",size:"the grid"},{path:"data/caleprocure/bids/all-bids.json",size:"150,672 bytes · 300 rows"},{path:"data/caleprocure/bids/index.json",size:"285 bytes"}],blocks:[`{
 "generated_at": "2026-07-28T21:23:44.137611+00:00",
 "snapshot_total": 300,
 "source": "caleprocure",
 "engine": "caleprocure",
 "endpoint": "https://caleprocure.ca.gov/pages/
 Events-BS3/event-search.aspx",
 "raw_grid_rows": 300,
 "open_total": 300,
 "state": "CA"
}`],notes:['300 rows read, 300 kept. Every one of the 300 has status: "Posted".'],tables:[]},{label:"Real record Bid A as the grid gives it",paths:[],blocks:[`{
 "bid_id": "26-10330",
 "title": "IFB 26-10330 Mass Printing and
 Mass Mailing",
 "buyer": "Department of Public Health",
 "agency": "Department of Public Health",
 "state": "CA",
 "due_date": "2026-07-28",
 "due_date_raw": "07/28/20263:00PM PDT",
 "status": "Posted",
 "detail_url": "https://caleprocure.ca.gov/pages/
 Events-BS3/event-search.aspx",
 "description": "",
 "_detail_ok": false
}`],notes:["Empty description, and the link points at the search page — the same for all 300 rows at this moment. The title is the only thing carrying meaning, which is why triage works here at all."],tables:[]}],notes:[],then:"the snapshot is split into old news and new news"},{n:"4",title:"Diff against the last archive",who:"run_daily.py → platform_sweep.prep",summary:["Every bid already decided on a past day keeps its old decision (carryover). Only bids never seen before go to the AI. Tonight: 259 carried, 41 new, measured against the 288 ids in the 24 July archive.",'This is also where a judge row is built for every bid in the snapshot — all 300 of them, 181,646 bytes. Nearly all of those rows are hollow: they are built before anything gets enriched, so the line that says "RFP body" is followed by nothing.'],cells:[{label:"Out",paths:[{path:"runs/triage-input.json",size:"9,654 bytes · 41 rows"},{path:"runs/triage-carryover.json",size:"32,956 bytes · 259 rows"},{path:"runs/judge-input.json",size:"181,646 bytes · 300 rows"},{path:"runs/_funnel.json",size:"156 bytes"}],blocks:[`{
 "date": "2026-07-28",
 "snapshot_total": 300,
 "carryover_count": 259,
 "triage_input_count": 41,
 "prior_archive_ids_compared_against": 288
}`],notes:[],tables:[]},{label:"Real records Bid A — carried, not re-asked",paths:[],blocks:[`runs/triage-carryover.json
{
 "bid_id": "26-10330",
 "decision": "SKIP",
 "reason": "printing and mailing"
}`,`runs/judge-input.json — row 0 of 300
{
 "idx": 0,
 "bid_id": "26-10330",
 "title": "IFB 26-10330 Mass Printing and
 Mass Mailing",
 "buyer": "Department of Public Health",
 "state": "CA",
 "due_date": "2026-07-28",
 "detail_url": "https://caleprocure.ca.gov/pages/
 Events-BS3/event-search.aspx",
 "description_full": "Title: IFB 26-10330 Mass Printing
 and Mass Mailing\\nBuyer: Department of Public Health\\n
 State: CA\\nCloses: 2026-07-28\\nSource URL: https://
 caleprocure.ca.gov/pages/Events-BS3/event-search.aspx
 \\n\\nRFP body (truncated to 6KB):\\n"
}`],notes:['Look at the end of description_full: "RFP body (truncated to 6KB):" and then the string stops. That is what almost all 300 rows in this file look like. The file the judge actually reads is built later, at stage 7.'],tables:[]}],notes:[],then:"only the 41 new titles are shown to the AI"},{n:"5",title:"Triage — worth a real look, or not",who:"Agent max-triage · Pass 1",summary:["Six fields per bid, and the useful one is the title. Cal eProcure titles are unusually rich: they carry the bid number, the service and often the list of counties. The default answer is SKIP.","Tonight the AI saw 41 titles and marked 4 OPEN, 37 SKIP. Bid A is not in this file at all — its SKIP was decided on an earlier day and simply re-used."],cells:[{label:"In → Out",paths:[{path:"runs/triage-input.json",size:"9,654 bytes · 41 rows"},{path:"runs/triage-verdicts.json",size:"5,240 bytes · 41 rows"}],blocks:[`{
 "idx": 151,
 "bid_id": "10A2942",
 "title": "*Certified SB/MB or DVBE Only* Tree
 Trimming, Pruning, and Removal Services in Alpine,
 Amador, Calaveras, Mariposa, Merced, San Joaquin,
 Stanislaus, and Tuolumne Counties.",
 "buyer": "Department of Transportation",
 "state": "CA",
 "due_date": "2026-08-10"
}`],notes:[],tables:[]},{label:"What came back Bid B — opened",paths:[],blocks:[`{
 "idx": 151,
 "bid_id": "10A2942",
 "decision": "OPEN",
 "reason": "Caltrans tree trimming and removal"
}`],notes:["For a SKIP, this is the end. A bid marked SKIP here never gets its page opened, so its description stays empty forever and nothing ever looks at it again. The whole decision rested on one title. That is 37 bids tonight, and 285 across the whole snapshot."],tables:[]}],notes:[],then:"the browser window opens again — only for the 4 OPENs"},{n:"6",title:"Go and get the scope",who:"platform_sweep.enrich_opens → engines/caleprocure.py",summary:["For each OPEN bid the real browser starts again, types the event id into the search box, clicks Go, clicks the matching cell, and reads the pop-up that appears. That pop-up is the only place the description, the county list, the contact name and the contact email exist.","Only the OPENs are opened, one at a time, with a pause between them. That is deliberate: this is a public site being driven by a visible browser, and going through all 300 would be loud and slow."],cells:[{label:"In → Out",paths:[{path:"runs/triage-verdicts.json",size:"the 4 OPEN ids"},{path:"bids/all-bids.json",size:"patched in place · 300 rows"}],blocks:[],notes:["Read those four and ten together. The four rows with a real event link are exactly the four opened tonight. The other six descriptions were captured on earlier days and survive because the snapshot writer only fills fields the fresh row left empty. The link is never empty — the pull always writes the search page over it. So the scope survives a re-pull and the deep link does not.","And the gap between 10 and 6 puts fresh numbers on an open question in the model doc. Page text is written by the same branch as the description, so it asked why only some enriched rows have it. Tonight's split narrows it: the 6 rows with page text are the 4 enriched tonight plus 07A6399 and 07A6402; the 4 rows with a description but no page text (08A3964, 0000039779, 05A3033, 0000039810) are all older carried-forward captures. The likely reading is that the line saving page text did not exist when those four were enriched. It stays a reading: the files show the split, not the date each capture happened."],tables:[[{header:!1,cells:["rows with a description","10 of 300"]},{header:!1,cells:["rows with a contact email","10 of 300"]},{header:!1,cells:["rows with saved page text","6 of 300"]},{header:!1,cells:["rows with a real /event/ link","4 of 300"]},{header:!1,cells:["rows with any documents","0 of 300"]}]]},{label:"Real record Bid B — after the pop-up",paths:[],blocks:[`{
 "bid_id": "10A2942",
 "title": "*Certified SB/MB or DVBE Only* Tree
 Trimming, Pruning, and Removal Services in Alpine,
 Amador, …, and Tuolumne Counties.",
 "buyer": "Department of Transportation",
 "due_date": "2026-08-10",
 "due_date_raw": "08/10/20262:00PM PDT",
 "status": "Posted",
 "detail_url": "https://caleprocure.ca.gov/event/
 2660/10A2942",
 "description": "Contractor agrees to provide to the
 California Department of Transportation (Caltrans)
 tree trimming, pruning, and removal services as
 described herein. … Service Area (county): Alpine,
 Amador, Calaveras, Mariposa, Merced, San Joaquin,
 Stanislaus, Tuolumne … Documents: solicitation
 package available via 'View Event Package' on the
 Cal eProcure event page.",
 "_detail_ok": true,
 "_detail_err": "no_popup",
 "page_text": "Contractor agrees to provide to the
 California Department of Transportation (Caltrans)…",
 "contact_email": "gurinder.kaur@dot.ca.gov",
 "contact_name": "Gurinder Kaur"
}`],notes:['This row says _detail_ok: true and _detail_err: "no_popup" at the same time, and it is the only row in the whole 300-row file carrying an error stamp. The text plainly arrived. The only two lines that ever write that stamp are failure branches (engines/caleprocure.py:380,384) and the success path never removes it, so a stamp left by an earlier attempt is carried forward with the rest of the old enrichment.'],tables:[]}],notes:[],then:"the judge's real input is assembled from the enriched snapshot"},{n:"7",title:"Build the short list for the judge",who:"platform_sweep.build_judge_input_open",summary:["This picks the bids that still need a verdict: tonight's new OPENs, plus any older OPEN that never got judged, plus any judged bid whose material visibly changed. It then re-reads the snapshot so the scope just captured is in the prompt.","Tonight that list is 4 rows. The 11 OPENs carried over from earlier days all had verdicts already, so no judging was bought for them."],cells:[{label:"In → Out",paths:[{path:"runs/triage-verdicts.json + triage-carryover.json + last archive verdicts.json",size:null},{path:"bids/all-bids.json",size:"re-read for the scope"},{path:"runs/judge-input-open.json",size:"4,248 bytes · 4 rows"}],blocks:[],notes:["A real defect sits in this file. The scope is pulled from the freshly enriched snapshot, but the link is copied from the row built back at stage 4 — platform_sweep.py:293-296 writes Source URL: {rec['detail_url']}, and rec is the prep-time row read out of judge-input.json, not the enriched one. So on the one night this system actually holds the real event address for this bid, the judge is still handed the search page as the source. Compare the two records: same bid, same run, two different links."],tables:[]},{label:"Real record Bid B — what the judge reads",paths:[],blocks:[`{
 "idx": 151,
 "bid_id": "10A2942",
 "buyer": "Department of Transportation",
 "state": "CA",
 "due_date": "2026-08-10",
 "detail_url": "https://caleprocure.ca.gov/pages/
 Events-BS3/event-search.aspx",
 "description_full": "Title: *Certified SB/MB or DVBE
 Only* Tree Trimming, Pruning, and Removal Services in
 Alpine, …, and Tuolumne Counties.\\nBuyer: Department
 of Transportation\\nState: CA\\nCloses: 2026-08-10\\n
 Source URL: https://caleprocure.ca.gov/pages/
 Events-BS3/event-search.aspx\\n\\nRFP body:\\nContractor
 agrees to provide to the California Department of
 Transportation (Caltrans) tree trimming, pruning, and
 removal services as described herein. … Service Area
 (county): Alpine, Amador, Calaveras, Mariposa, Merced,
 San Joaquin, Stanislaus, Tuolumne …"
}`],notes:['Real scope, wrong link. Note also "RFP body:" here versus "RFP body (truncated to 6KB):" in the stage-4 file — that is how you tell the two apart at a glance.'],tables:[]}],notes:[],then:"four bids get a score"},{n:"8",title:"Judge — would LGS bid this?",who:"Agent max-bid-judge · Pass 2",summary:["Yes, maybe or no, with a score out of 100, a reason and the warning flags. Tonight: 1 yes, 0 maybe, 3 no. That single YES is Bid B at 85.","California is outside LGS's eight home states, so nearly every judged bid here carries an out-of-core flag — 3 of tonight's 4 verdicts do, and 14 of the 15 rows in the day's file (08A3964 uses the variant name out_of_core_state_CA; 0000039874 carries no out-of-core marker at all). It is a flag, never a rejection — the judge scored this one 85 anyway and left the decision with the operator."],cells:[{label:"In → Out",paths:[{path:"runs/judge-input-open.json",size:"4 rows"},{path:"runs/judge-verdicts.json",size:"2,634 bytes · 4 rows"}],blocks:[`10A2942 yes 85
0000039874 no 15
04-2W3704 no 15
04-0W0504 no 12`],notes:["Four of the five YES on this portal tonight were not judged tonight. They are standing verdicts from earlier days, merged back in at the next stage. Only 10A2942 is new work."],tables:[]},{label:"Real record Bid B — YES, 85",paths:[],blocks:[`{
 "bid_id": "10A2942",
 "title": "*Certified SB/MB or DVBE Only* Tree
 Trimming, Pruning, and Removal Services in Alpine,
 Amador, …, and Tuolumne Counties.",
 "would_lgs_bid": "yes",
 "score": 85,
 "primary_reason": "Caltrans multi-county tree
 trimming, pruning, and removal across eight counties
 is straight Category 2/5 LGS work and matches a proven
 Cal eProcure win pattern. The only thing standing
 between LGS and this bid is the certification gate,
 not the scope.",
 "red_flags": [
 "out_of_core_state",
 "set_aside_certified_sb_mb_or_dvbe_only",
 "large_out_of_state_firm_likely_ineligible_
 verify_cert_path"
 ],
 "due_date": "2026-08-10"
}`],notes:[],tables:[]}],notes:[],then:"tonight's four verdicts are merged with eleven standing ones"},{n:"9",title:"Write the day's archive",who:"platform_sweep.compile_archive",summary:["Carryover and new triage are merged into one file of 300 decisions. Standing verdicts for bids still in tonight's snapshot are merged with tonight's four, which is how 4 verdicts become 15. Then five files and one index row are written.","This folder is the durable record. Everything after this point reads it, not the live portal."],cells:[{label:"data/caleprocure/daily/2026-07-28/",paths:[],blocks:[],notes:['"new-bids.json" is not new bids. It is byte-for-byte the same file as bids/all-bids.json — same 150,672 bytes, same checksum, 300 rows, not 41. The only place downstream that opens it by name is a fallback new-count in the Supabase publisher (publish_to_supabase.py:950-963), and for this portal even that never fires: stats.json already carries new_to_triage, and the explicit key wins. Bid detail reaches the database from the fixture, not from this file. Nothing is lost by it; the name is simply a lie.'],tables:[[{header:!0,cells:["File","Holds","Size"]},{header:!1,cells:["triage.json","300 decisions · 15 OPEN, 285 SKIP","38,193 B"]},{header:!1,cells:["verdicts.json","15 rows · 5 yes, 0 maybe, 10 no","13,166 B"]},{header:!1,cells:["new-bids.json","300 rows — the whole snapshot","150,672 B"]},{header:!1,cells:["stats.json","the funnel counts","485 B"]},{header:!1,cells:["report.md","the human summary","3,210 B"]}]]},{label:"Real records — the same file, two different shapes",paths:[],blocks:[`verdicts.json — judged tonight
{
 "bid_id": "10A2942",
 "would_lgs_bid": "yes",
 "verdict": "yes",
 "score": 85,
 "primary_reason": "Caltrans multi-county tree
 trimming, pruning, and removal across eight counties…",
 "red_flags": ["out_of_core_state", …],
 "due_date": "2026-08-10",
 "bid_key": "caleprocure:10A2942"
}`,`verdicts.json — carried from an earlier day
{
 "bid_id": "10A2853",
 "would_lgs_bid": "yes",
 "verdict": "yes",
 "score": 70,
 "lgs_score": 70,
 "primary_reason": "Eight-county Caltrans tree
 trimming/pruning/removal; multi-county scale +
 verbatim Cat 4/5 verbs. SB/DVBE set-aside =
 operator decision.",
 "reasoning": "Eight-county Caltrans tree
 trimming/pruning/removal; …",
 "red_flags": ["out_of_core_state",
 "set_aside_flag",
 "thin_description_pull_rfp_packet"]
}`],notes:["One file, 15 rows, five different key sets. The old rows carry lgs_score and reasoning; tonight's four carry due_date and bid_key and neither of the old two. The tidy-up step only copies lgs_score into score, never the other way (platform_sweep.py:332-333) — so the model doc's claim that both key families always get filled is only half true on disk."],tables:[]}],notes:["Three of the five YES were scored on a title alone. 10A2853 (70), 04A7578 (68) and 07A6388 (70) sit in tonight's snapshot with a zero-length description, because they were triaged OPEN and judged on a day whose pop-up capture left nothing behind. 10A2853's own red flags say it: thin_description_pull_rfp_packet. Their verdicts have carried unchanged ever since."],then:"the portal's own night is done — the shared machinery starts"},{n:"10",title:"Carry forward — deliberately skips this portal",who:"2.5 · scripts/carry_forward_verdicts.py --all",summary:["The shared safety net only touches portals whose registry says carry_forward: orchestrator. This portal says engine-internal, so the shared run filters it out and writes nothing for it.","That is not a gap. This portal already carried everything forward twice, inside its own sweep, and running the shared one on top would apply the same carry a second time."],cells:[{label:"Where the two carries actually happen",paths:[],blocks:[],notes:[],tables:[[{header:!1,cells:["Half one · stage 4, prep","old triage decisions are re-adopted — 259 rows tonight"]},{header:!1,cells:["Half two · stage 9, compile","standing verdicts for bids still in the snapshot are merged — 11 rows tonight"]},{header:!1,cells:["Shared run 2.5","nothing for this portal, by design"]}]]}],notes:[],then:"the ledger, the report and the board fixture"},{n:"11",title:"Ledger, report, and the hand-off to the board",who:"2.6 portals_cumulative.py · 2.7 standardize_daily_reports.py · 2.8 dump_yes_for_portalpro.py",summary:["Three shared steps. The ledger walks every verdicts.json this portal ever wrote and folds its YES bids into the all-portal list. The report writer overwrites the report.md that compile just made with the one shared layout. The fixture dump turns this portal's YES bids into board cards — the real moment the data stops being portal-shaped.",'A MAYBE never leaves this portal. The dump sends only verdict "yes" for non-federal portals, so a caleprocure MAYBE is archived on disk and goes no further. There were 0 maybes tonight, but the archive index is not all zeros: 18 of its 32 dated rows carry 1 to 3 maybes, every one of them in June. Each of those was written to disk and stopped there.'],cells:[{label:"report.md · the counts block, 4 lines of a 3,210-byte file",paths:[],blocks:[`- Snapshot: **300** open bids
- Carryover: 259 · NEW today: 41
- Triage: 15 OPEN / 285 SKIP
- Scored: **5 YES / 0 MAYBE / 10 NO**`],notes:["Four of the five YES links in that report point at the search page. Only Bid B's line carries https://caleprocure.ca.gov/event/2660/10A2942, because Bid B is the one YES enriched in this run. The report reads detail_url straight out of the snapshot, and stage 6 explained why that field is almost always the search page."],tables:[]},{label:"Real board card Bid B · read from the fixture on 5 August",paths:[],blocks:[`{
 "id": "389377a0130df6e4",
 "portal": "caleprocure",
 "source_bid_id": "10A2942",
 "buyer": "Department of Transportation",
 "state": "CA",
 "solicitation_no": null,
 "federal": false,
 "score": 85,
 "verdict": "yes",
 "category": "",
 "due_date": "2026-08-10",
 "source_url": "https://caleprocure.ca.gov/event/
 2660/10A2942",
 "contact_name": "Gurinder Kaur",
 "contact_email": "gurinder.kaur@dot.ca.gov",
 "contact_phone": null,
 "first_seen": "2026-07-28",
 "last_seen": "2026-07-28",
 "has_documents": false
}`],notes:["The fixture on disk today holds 11 caleprocure cards out of 1,470. Ten of the eleven carry the search page as their link. This one carries the real event address, because its snapshot row still had it when the dump ran."],tables:[]}],notes:[],then:"the cards meet every other portal's cards"},{n:"12",title:"Publish, cluster, dedupe",who:"2.85 · publish_to_supabase.py → llm_dedup_candidates.py → bid-dedup-judge → apply_llm_dedup.py",summary:["The fixture is read (not the portal folder) and the YES bids are pushed into the shared database next to every other portal's. Bids are then grouped into clusters, so one solicitation seen on two portals shows up once for the operator.","Grouping blocks on the cleaned-up title plus the state, with the cleaned-up solicitation number plus state as a second key. This portal's buyers are real California department names, which is the good case for that rule."],cells:[{label:"In → Out",paths:[{path:"PortalPro/src/fixtures/portal-bids.json",size:"the cards"},{path:"data/caleprocure/daily/2026-07-28/{stats,new-bids}.json",size:"the run row · new-bids only as an unused fallback count"},{path:"supabase: portals · bids · clusters · sweep_runs",size:"upsert"}],blocks:[],notes:[`An open question this run puts on the table. Two of tonight's five YES rows are near-identical: 10A2853 at score 70, closing 2026-12-24, and 10A2942 at score 85, closing 2026-08-10. Both titles read "*Certified SB/MB or DVBE Only* Tree Trimming, Pruning, and Removal Services in Alpine, Amador, Calaveras, Mariposa, Merced, San Joaquin, Stanislaus, and Tuolumne Counties" — one with a full stop at the end, one without. Two event ids and two close dates. Whether that is one solicitation re-posted or two real events is not answerable from these files, and this page did not check what the clustering step did with them. It is worth an operator's eye.`],tables:[]}],notes:[],then:"now, and only now, can the files be fetched"},{n:"13",title:"The documents pass — this portal's own",who:"2.85b caleprocure_doc_capture.py · 2.85c run_enrichment_phase.py (shared passes)",summary:['Solicitation files sit behind a "View Event Package" button, and the download addresses the site hands out are one-time session tokens. They cannot be saved for a later fetcher. So documents get their own pass, after publishing: re-open the event in a real browser, click through to the attachment list, download each file in the same session, upload it, and patch the real event link, description and contact straight into the database.',"The shared passes then run for everyone: engine-recorded documents published, saved page text pushed up, contact columns filled from description text, and a backstop that re-runs the doc pass for bids that still have none."],cells:[{label:null,paths:[],blocks:[],notes:["One documented dead end, and a question about it. The portal README records event 05A2959 as a single attachment that never completes a download under automation after about thirteen different approaches; a human click works. Yet the fixture card for 05A2959 on disk today says it has documents. Either a later re-run caught it or the file arrived another way. The files do not say which."],tables:[[{header:!0,cells:["Fact","What it means here"]},{header:!1,cells:["0 of 300 snapshot rows carry documents","the shared engine-recorded doc publisher has nothing to publish for this portal — every caleprocure file on the board came from this one pass"]},{header:!1,cells:["8 of the 11 fixture cards say has_documents: true (read 5 August)","the pass does work, and it is idempotent — it skips files already there"]},{header:!1,cells:["Bid B says has_documents: false","tonight's YES had no files attached at the time the fixture was written"]},{header:!1,cells:["The link is only patched when the popped-up address really contains /event/","a one-time download address is refused rather than saved as the bid's link"]}]]}],notes:[],then:"the documents become requirements, and dedupe gets a second look"},{n:"14",title:"Requirements, then dedupe again",who:"2.87 extract_doc_text.py + requirements-extractor + apply_requirements.py · 2.875 dedup re-pass",summary:[`The text is read out of each cluster's documents and an agent is asked what the bid actually demands: bonds, licences, insurance, a pre-bid meeting. This portal contributes whatever the documents pass managed to download. A cluster whose download failed gets a plain "no material" row rather than a blank, so the board never claims a bid was simply never looked at.`,"Then dedupe runs a second time. Enrichment has just filled in buyers and close dates that were blank the first time, which makes new pairs comparable. Only that residue is re-judged."],cells:[{label:"How much this portal actually overlaps with the others",paths:[],blocks:[`data/portals/overlap.json · generated 2026-07-24
method: normalized-title collision across each portal's latest snapshot
{"a": "caleprocure", "b": "demandstar", "shared": 3}
{"a": "caleprocure", "b": "ionwave", "shared": 1}
{"a": "caleprocure", "b": "louisiana-lapac", "shared": 1}
{"a": "caleprocure", "b": "napc", "shared": 1}
{"a": "caleprocure", "b": "texas-esbd", "shared": 1}`],notes:["Seven shared titles in total. California state work barely appears anywhere else we watch, so cross-portal dedupe has little to do for this portal. Note the file was generated 24 July, not on the anchor run."],tables:[]}],notes:[],then:"what changed, who gets told, did the run finish"},{n:"15",title:"Changes, mail, and the numbers a human reads",who:"2.88 watch + digests + sentinel · 2.89 packs · 2.9-2.96 boards · scorecard",summary:["Tonight's snapshot is diffed against the last archived one for the changes the list page itself shows. Then the digests go out, the packs are rebuilt, the boards are redrawn, and the health check runs."],cells:[{label:null,paths:[],blocks:[],notes:[],tables:[[{header:!1,cells:["Watch mode is none","no second capture of the bid page for this portal"]},{header:!1,cells:["But the free list-watcher loops every registered portal","close-date moves and status changes still become bid_updates rows"]},{header:!1,cells:["No addendum markers on this portal's list","in practice the signals are date and status moves only"]},{header:!1,cells:["Discovery, deadline and contract digests","a silent no-op until RESEND_API_KEY exists in data/auth/resend.env"]},{header:!1,cells:["Bid packs","one folder per keyed cluster, with the event scope and whatever files were captured"]},{header:!1,cells:["Monitor and overview boards","built from every day's stats.json; the state label beside the portal comes from a hardcoded map (build_portal_metrics.py:37-45) that has no caleprocure row, so the boards show this portal with a blank state and treat it as out-of-core by default — the right answer for the wrong reason. The CA on each bid row is stamped much earlier, by the engine out of config.json"]},{header:!1,cells:["Scorecard","the only real YES number — it queries the database, which is what the app shows. Adding up per-portal scoring.yes is explicitly wrong: this portal's 5 is cumulative-live, not tonight's count"]}]]}],notes:[],then:null}],d=[{heading:"The quirks that bite",tables:[[{header:!0,cells:["Quirk","Consequence"]},{header:!1,cells:["A wall on the site returns 403 to hidden browsers","both the pull and the enrich drive a visible Chromium on the operator's machine; this portal cannot run unattended"]},{header:!1,cells:["No cold deep link exists","an event page only opens by searching its id in the same session and clicking the grid cell; typing the address in fresh lands on an error page"]},{header:!1,cells:["Every pulled row's detail_url is the search page","the enriched /event/ link is overwritten by the next pull, because the snapshot writer only backfills fields the fresh row left empty. On 28 July, 4 of 300 rows carry a real link — exactly the 4 enriched that night"]},{header:!1,cells:["The judge is handed the wrong link in the same run",'platform_sweep.py:293-296 copies the prep-time detail_url, not the enriched one, so the "Source URL" line says search page even for a bid whose real address was just captured']},{header:!1,cells:["new-bids.json is byte-identical to all-bids.json","same checksum, 300 rows, not 41. The only reader that opens it by name is the publisher's fallback new-count (publish_to_supabase.py:950-963), which this portal never reaches — stats.json already carries new_to_triage"]},{header:!1,cells:["Only triage-OPEN bids get their pop-up opened","10 of 300 rows carry a description; every SKIP is final and was decided on a title alone"]},{header:!1,cells:["Download addresses are one-time session tokens","0 of 300 snapshot rows carry documents; files exist only through the separate post-publish pass"]},{header:!1,cells:["Event 05A2959 never completes a download under automation","documented after roughly thirteen approaches; a human click works. Its board card says it has documents today, and disk does not say how"]},{header:!1,cells:["One verdicts.json, five different key sets across 15 rows",`the judge is dispatched from a per-portal skill with no fixed shape; the tidy-up only copies lgs_score into score, never back, so the model doc's "both key families are filled" is half true`]},{header:!1,cells:["triage.json rows come in three shapes","164 rows are {bid_id, decision, reason}, 109 add idx, 27 add title. No row carries the title the model doc lists as standard — that is why the inspector's SKIP tracer shows a null title"]},{header:!1,cells:["A MAYBE never leaves this portal",'the fixture dump sends only "yes" for non-federal portals, so a MAYBE is archived and goes no further. 0 maybes on 28 July, but 18 of the 32 dated rows in the archive index carry 1 to 3 maybes (all June) — each one written to disk and stopped there']},{header:!1,cells:["Three files in runs/ have no writer anywhere in the repo","_triage_prompt.json (46,510 bytes, not even valid text — the inspector could not parse it), _triage_raw.json (325 rows with no bid ids), _rejudge_nogeo.json (5 rows). Stale scratch, not pipeline output"]},{header:!1,cells:["data/caleprocure/PORTAL.md is a draft","every field-map row says TODO, its health numbers are from 14 July, and it never mentions the visible-browser constraint or the documents pass — both of which the README does document"]},{header:!1,cells:["The model doc quotes the 24 July run","its worked examples say 288 snapshot / 18 new / 12 OPEN. The anchor run here is 28 July: 300 / 41 / 15. The mechanisms it describes all held; the numbers are one run behind"]}]],paragraphs:["Generated 5 August 2026 by /portal-stages-visualise from the run of 28 July 2026. Every record above was read from the named file on disk; every count traces to data/caleprocure/daily/2026-07-28/stats.json, a row count, or a byte size. Baseline map: docs/portal-dataflow/caleprocure.md (evidence-cited to file:line). Where that map and the files disagreed, the files won and the difference is named on this page."]}],h="Generated 5 August 2026 by /portal-stages-visualise from the run of 28 July 2026. Every record above was read from the named file on disk; every count traces to data/caleprocure/daily/2026-07-28/stats.json, a row count, or a byte size. Baseline map: docs/portal-dataflow/caleprocure.md (evidence-cited to file:line). Where that map and the files disagreed, the files won and the difference is named on this page.",c="docs/portal-dataflow/pedia-caleprocure.html",p={slug:e,title:t,eyebrow:a,headline:s,lede:n,funnel:r,funnel_note:o,legend:i,stages:l,sections:d,footer:h,source_page:c};export{p as default,a as eyebrow,h as footer,r as funnel,o as funnel_note,s as headline,n as lede,i as legend,d as sections,e as slug,c as source_page,l as stages,t as title};

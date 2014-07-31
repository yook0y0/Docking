package org.docking.erbse.controller;

import java.io.IOException;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.docking.erbse.service.ReviewService;
import org.docking.erbse.util.Injector;
import org.docking.erbse.vo.EditorReviewBBSVO;


public class ReviewController
{
	private HttpServletRequest req;
	private HttpServletResponse res;
	private ReviewService rs;

	public ReviewController(){
		this.req = null;
		this.res = null;
		this.rs = (ReviewService)Injector.getInstance().getObject(ReviewService.class);
	}

	public void setReq(HttpServletRequest req) 
	{
		this.req = req;
	}

	public void setRes(HttpServletResponse res) 
	{
		this.res = res;
	}

	public void reviewAdd() throws IOException 
	{
		SimpleDateFormat    mSimpleDateFormat = new SimpleDateFormat ( "yyyy.MM.dd HH:mm:ss", Locale.KOREA );

		EditorReviewBBSVO   ervo = new EditorReviewBBSVO();
		ervo.setReviewId(req.getParameter("reviewId"));
		ervo.setEditorId(req.getParameter("editorId"));
		ervo.setMemberId(req.getParameter("memberId"));
		ervo.setBody(req.getParameter("body"));
		ervo.setScore(Integer.valueOf(req.getParameter("score")));
		ervo.setWrittenDate(mSimpleDateFormat.format(new Date()));

		Integer code = rs.reviewAdd(ervo);

		PrintWriter pw = res.getWriter();
		pw.write(code);
		pw.flush();
	}

	public void reviewModify() throws IOException 
	{
		SimpleDateFormat    mSimpleDateFormat = new SimpleDateFormat ("yyyy.MM.dd HH:mm:ss", Locale.KOREA );

		EditorReviewBBSVO   ervo = new EditorReviewBBSVO();
		ervo.setReviewId(req.getParameter("reviewId"));
		ervo.setEditorId(req.getParameter("editorId"));
		ervo.setMemberId(req.getParameter("memberId"));
		ervo.setBody(req.getParameter("body"));
		ervo.setScore(Integer.valueOf(req.getParameter("score")));
		ervo.setWrittenDate(mSimpleDateFormat.format (new Date()));

		Integer code = rs.reviewModify(ervo);

		PrintWriter pw = res.getWriter();
		pw.write(code);
		pw.flush();
	}

	public void reviewDelete() throws IOException 
	{
		String   reviewId = req.getParameter("reviewId");

		Integer code = rs.reviewDelete(reviewId);

		PrintWriter pw = res.getWriter();
		pw.write(code);
		pw.flush();
	}

	public void reviewSearch() throws IOException 
	{
		String   reviewId = req.getParameter("reviewId");

		String jRes = rs.reviewSearch(reviewId);
		
		PrintWriter pw = res.getWriter();
		pw.write(jRes);
		pw.flush();
	}

	public void reviewList() throws IOException 
	{
		String jRes = rs.reviewList();
		
		PrintWriter pw = res.getWriter();
		pw.write(jRes);
		pw.flush();
	}

	public void reviewListByEditor() throws IOException 
	{
		String   editorId = req.getParameter("editorId");

		String jRes = rs.reviewListByEditor(editorId);
		
		PrintWriter pw = res.getWriter();
		pw.write(jRes);
		pw.flush();
	}

	public void reviewListByWriter() throws IOException 
	{
		String   memberId = req.getParameter("memberId");

		String jRes = rs.reviewListByWriter(memberId);
		
		PrintWriter pw = res.getWriter();
		pw.write(jRes);
		pw.flush();
	}
}
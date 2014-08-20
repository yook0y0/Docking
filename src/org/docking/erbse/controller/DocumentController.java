package org.docking.erbse.controller;

import java.io.IOException;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.docking.erbse.service.DocumentService;
import org.docking.erbse.util.Injector;
import org.docking.erbse.vo.ContentVO;
import org.docking.erbse.vo.DocumentVO;
import org.docking.erbse.vo.MemberContentVO;
import org.docking.erbse.vo.MemberVO;


public class DocumentController 
{
	private HttpServletRequest req;
	private HttpServletResponse res;
	
	private DocumentService ds;
	
	public DocumentController(){
		this.req = null;
		this.res = null;
		this.ds = (DocumentService)Injector.getInstance().getObject(DocumentService.class);
	}
	
	public void setReq(HttpServletRequest req) {
		this.req = req;
	}
	public void setRes(HttpServletResponse res) {
		this.res = res;
	}
	
	public void documentAdd() throws IOException 
	{
		SimpleDateFormat    mSimpleDateFormat = new SimpleDateFormat ( "yyyy.MM.dd HH:mm:ss", Locale.KOREA );
		String	creationDate = mSimpleDateFormat.format(new Date());
		String	writer = ((MemberVO)req.getSession().getAttribute("logInMember")).getMemberId();
		String	documentId = writer + "/" + creationDate;
		
		DocumentVO dvo = new DocumentVO();
		dvo.setDocumentId(documentId);
		dvo.setWriter(writer);
		dvo.setTitle(req.getParameter("title"));
		dvo.setCreationDate(creationDate);
		
		MemberContentVO	memberContentVO = new MemberContentVO();
		memberContentVO.setDocumentId(documentId);
		memberContentVO.setMemberId(writer);
		memberContentVO.setMemberPosition(2);
		
		Integer code = ds.documentAdd(dvo,memberContentVO);
		
		PrintWriter pw = res.getWriter();
		pw.write(code);
		pw.flush();
	}
	
	public void documentModify() throws IOException 
	{
		SimpleDateFormat    mSimpleDateFormat = new SimpleDateFormat ( "yyyy.MM.dd HH:mm:ss", Locale.KOREA );
		String	creationDate = mSimpleDateFormat.format(new Date());
		String	writer = ((MemberVO)req.getSession().getAttribute("logInMember")).getMemberId();
		
		DocumentVO dvo = new DocumentVO();
		dvo.setDocumentId(req.getParameter("documentId"));
		dvo.setWriter(writer);
		dvo.setTitle(req.getParameter("title"));
		dvo.setCreationDate(creationDate);

		Integer code = ds.documentModify(dvo);
		
		PrintWriter pw = res.getWriter();
		pw.write(code);
		pw.flush();
	}
	
	public void documentDelete() throws IOException 
	{
		String documentId = req.getParameter("documentId");
		
		Integer code = ds.documentDelete(documentId);
		
		PrintWriter pw = res.getWriter();
		pw.write(code);
		pw.flush();
	}
	
	public void documentSearch() throws IOException 
	{
		String documentId = req.getParameter("documentId");
		
		String jRes = ds.documentSearch(documentId);
		
		PrintWriter pw = res.getWriter();
		pw.write(jRes);
		pw.flush();
	}
	
	public void ownDocumentList() throws IOException 
	{
		String documentId = req.getParameter("documentId");

		String jRes = ds.ownDocumentList(documentId);
		
		PrintWriter pw = res.getWriter();
		pw.write(jRes);
		pw.flush();
	}
	
	public void joinDocumentList() throws IOException 
	{
		String memberId = ((MemberVO)req.getSession().getAttribute("logInMember")).getMemberId();

		String jRes = ds.joinDocumentList(memberId,((MemberVO)req.getSession().getAttribute("logInMember")).getMemberId());
		
		PrintWriter pw = res.getWriter();
		pw.write(jRes);
		pw.flush();		
	}
	
	public void contentAdd() throws IOException 
	{
		String	documentId = req.getParameter("documentId");
		String	editorId = req.getParameter("editorId");

		ContentVO cvo = new ContentVO();
		cvo.setDocumentId(documentId);
		//cvo.setContentId(documentId + "/" + editorId);
		cvo.setBody(req.getParameter("body"));
		cvo.setEditorId(editorId);
		
		Integer code = ds.contentAdd(cvo);

		PrintWriter pw = res.getWriter();
		pw.write(code);
		pw.flush();
	}
	
	public void contentModify() throws IOException 
	{
		ContentVO cvo = new ContentVO();
		cvo.setDocumentId(req.getParameter("documentId"));
		cvo.setContentId(req.getParameter("contentId"));
		cvo.setBody(req.getParameter("body"));
		cvo.setEditorId(req.getParameter("editorId"));
		
		Integer code = ds.contentModify(cvo);

		PrintWriter pw = res.getWriter();
		pw.write(code);
		pw.flush();
	}
	
	public void contentDelete() throws IOException {
		String contentId = req.getParameter("contentId");
		
		Integer code = ds.contentDelete(contentId);

		PrintWriter pw = res.getWriter();
		pw.write(code);
		pw.flush();
	}
	
	public void contentSearch() throws IOException 
	{
		String contentId = req.getParameter("contentId");

		String jRes = ds.contentSearch(contentId);
		
		PrintWriter pw = res.getWriter();
		pw.write(jRes);
		pw.flush();
	}
	
	public void contentsList() throws IOException 
	{
		String documentId = req.getParameter("documentId");
		
		String jRes = ds.contentsList(documentId,((MemberVO)req.getSession().getAttribute("logInMember")).getMemberId());
		
		PrintWriter pw = res.getWriter();
		pw.write(jRes);
		pw.flush();
	}
	
	public void memberInvite() throws IOException 
	{
		MemberContentVO mcvo = new MemberContentVO();
		mcvo.setDocumentId(req.getParameter("documentId"));
		mcvo.setMemberId(req.getParameter("memberId"));
		mcvo.setMemberPosition(1);

		Integer code = ds.memberInvite(mcvo);
		
		String	message = "SUCCESS!";
		
		if(code == -1)
		{
			message = "FAIL";
		}
		
		else if(code == -2)
		{
			message = "ALREADY INVITED MEMBER!";
		}

		PrintWriter pw = res.getWriter();
		pw.write(message);
		pw.flush();	
	}
	
	public void memberExpel() throws IOException 
	{
		MemberContentVO mcvo = new MemberContentVO();
		mcvo.setDocumentId(req.getParameter("documnetId"));
		mcvo.setMemberId(req.getParameter("memberId"));
		mcvo.setMemberPosition(Integer.valueOf(req.getParameter("memberPosition")));
		
		Integer code = ds.memberExpel(mcvo);

		PrintWriter pw = res.getWriter();
		pw.write(code);
		pw.flush();		
	}
	
	public void memberPositionUpdate() throws IOException {
		MemberContentVO mcvo = new MemberContentVO();
		mcvo.setDocumentId(req.getParameter("documnetId"));
		mcvo.setMemberId(req.getParameter("memberId"));
		mcvo.setMemberPosition(Integer.valueOf(req.getParameter("memberPosition")));
		
		Integer code = ds.memberPositionUpdate(mcvo);

		PrintWriter pw = res.getWriter();
		pw.write(code);
		pw.flush();	
	}
}

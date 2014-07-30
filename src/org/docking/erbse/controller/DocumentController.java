package org.docking.erbse.controller;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.docking.erbse.service.DocumentService;
import org.docking.erbse.service.DocumentServiceImpl;
import org.docking.erbse.vo.ContentVO;
import org.docking.erbse.vo.DocumentVO;
import org.docking.erbse.vo.MemberContentVO;


public class DocumentController 
{
	private HttpServletRequest req;
	private HttpServletResponse res;
	
	private DocumentService ds;
	
	public DocumentController(){
		this.req = null;
		this.res = null;
		this.ds = new DocumentServiceImpl();
	}
	
	public void setReq(HttpServletRequest req) {
		this.req = req;
	}
	public void setRes(HttpServletResponse res) {
		this.res = res;
	}
	
	public void documentAdd() throws IOException {
		DocumentVO dvo = new DocumentVO();
		dvo.setDocumentId(req.getParameter("documentId"));
		dvo.setWriter(req.getParameter("writer"));
		dvo.setTitle(req.getParameter("title"));
		dvo.setCreationDate(req.getParameter("creationDate"));
		
		Integer code = ds.documentAdd(dvo);
		
		PrintWriter pw = res.getWriter();
		pw.write(code);
		pw.flush();
	}
	
	public void documentModify() throws IOException {
		DocumentVO dvo = new DocumentVO();
		dvo.setDocumentId(req.getParameter("documentId"));
		dvo.setWriter(req.getParameter("writer"));
		dvo.setTitle(req.getParameter("title"));
		dvo.setCreationDate(req.getParameter("creationDate"));

		Integer code = ds.documentModify(dvo);
		
		PrintWriter pw = res.getWriter();
		pw.write(code);
		pw.flush();
	}
	
	public void documentDelete() throws IOException {
		String documentId = req.getParameter("docuemntId");
		
		Integer code = ds.documentDelete(documentId);
		
		PrintWriter pw = res.getWriter();
		pw.write(code);
		pw.flush();
	}
	
	public void documentSearch() throws IOException {
		String documentId = req.getParameter("documentId");
		
		String jRes = ds.documentSearch(documentId);
		
		PrintWriter pw = res.getWriter();
		pw.write(jRes);
		pw.flush();
	}
	
	public void ownDocumentList() throws IOException {
		String writer = req.getParameter("writer");

		String jRes = ds.ownDocumentList(writer);
		
		PrintWriter pw = res.getWriter();
		pw.write(jRes);
		pw.flush();
	}
	
	public void joinDocumentList() throws IOException {
		String memberId = req.getParameter("memberId");

		String jRes = ds.joinDocumentList(memberId);
		
		PrintWriter pw = res.getWriter();
		pw.write(jRes);
		pw.flush();		
	}
	

	
	public void contentAdd() throws IOException {
		ContentVO cvo = new ContentVO();
		cvo.setDocumentId(req.getParameter("documentId"));
		cvo.setContentId(req.getParameter("contentId"));
		cvo.setBody(req.getParameter("body"));
		cvo.setEditorId(req.getParameter("editorId"));
		
		Integer code = ds.contentAdd(cvo);

		PrintWriter pw = res.getWriter();
		pw.write(code);
		pw.flush();
	}
	
	public void contentModify() throws IOException {
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
	
	public void contentSearch() throws IOException {
		String contentId = req.getParameter("contentId");

		String jRes = ds.contentSearch(contentId);
		
		PrintWriter pw = res.getWriter();
		pw.write(jRes);
		pw.flush();
	}
	
	public void contentsList() throws IOException {
		String documentId = req.getParameter("documentId");
		
		String jRes = ds.contentsList(documentId);
		
		PrintWriter pw = res.getWriter();
		pw.write(jRes);
		pw.flush();
	}
	
	public void memberInvite() throws IOException {
		MemberContentVO mcvo = new MemberContentVO();
		mcvo.setDocumentId(req.getParameter("documnetId"));
		mcvo.setMemberId(req.getParameter("memberId"));
		mcvo.setMemberPosition(Integer.valueOf(req.getParameter("memberPosition")));

		Integer code = ds.memberInvite(mcvo);

		PrintWriter pw = res.getWriter();
		pw.write(code);
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

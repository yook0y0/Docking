package kr.co.docking.controller;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import kr.co.docking.action.AddAction;
import kr.co.docking.action.DeleteAction;
import kr.co.docking.action.ModifyAction;
import kr.co.docking.action.SearchAction;
import kr.co.docking.util.Injector;
import kr.co.docking.vo.ContentVO;
import kr.co.docking.vo.DocumentVO;
import kr.co.docking.vo.MemberContentVO;

public class DocumentController 
{
	private HttpServletRequest req;
	private HttpServletResponse res;
	public void setReq(HttpServletRequest req) {
		this.req = req;
	}
	
	public void setRes(HttpServletResponse res) {
		this.res = res;
	}
	
	public void documentCreate() throws IOException {
		DocumentVO dvo = new DocumentVO();
		dvo.setDocumentId(req.getParameter("documentId"));
		dvo.setWriter(req.getParameter("writer"));
		dvo.setTitle(req.getParameter("title"));
		dvo.setCreationDate(req.getParameter("creationDate"));
		
		AddAction addAction = (AddAction)Injector.getInstance().getObject(AddAction.class);		
		addAction.documentAdd(dvo);
		
		PrintWriter pw = res.getWriter();
		pw.write("documentCreate");
		pw.flush();
	}
	
	public void documentUpdate() throws IOException {
		DocumentVO dvo = new DocumentVO();
		dvo.setDocumentId(req.getParameter("documentId"));
		dvo.setWriter(req.getParameter("writer"));
		dvo.setTitle(req.getParameter("title"));
		dvo.setCreationDate(req.getParameter("creationDate"));

		ModifyAction modifyAction = (ModifyAction)Injector.getInstance().getObject(ModifyAction.class);
		modifyAction.documentModify(dvo);
		
		PrintWriter pw = res.getWriter();
		pw.write("documentUpdate");
		pw.flush();
	}
	
	public void documentInfo() throws IOException {
		String documentId = req.getParameter("documentId");
		
		SearchAction searchAction = (SearchAction)Injector.getInstance().getObject(SearchAction.class);
		
		DocumentVO dvo = searchAction.documentSearch(documentId);
		List<ContentVO> cvoList = searchAction.contentSearchByDocumentId(documentId);
		List<MemberContentVO> mcvoList = searchAction.memberContentSearchByDocumentId(documentId);
		
		PrintWriter pw = res.getWriter();
		pw.write("documentRead");
		/*
		 * DocumentVO,ContentVO List,MemberContentVO List 보내야함
		 */
		pw.flush();
	}
	
	public void documentReadAll() throws IOException {
		SearchAction searchAction = (SearchAction)Injector.getInstance().getObject(SearchAction.class);
		List<DocumentVO> dvo = searchAction.documentSearchAll();
		
		PrintWriter pw = res.getWriter();
		pw.write("documentReadAll");
		/*
		 * DocumentVO List 보내야함
		 */
		pw.flush();
	}
	
	public void documentOwnerList() throws IOException {
		String writer = req.getParameter("writer");
		SearchAction searchAction = (SearchAction)Injector.getInstance().getObject(SearchAction.class);
		List<DocumentVO> dvo = searchAction.documentSearchByWriter(writer);
		
		PrintWriter pw = res.getWriter();
		pw.write("documentOwnerList");
		/*
		 * DocumentVO List 보내야함
		 */
		pw.flush();
	}
	
	public void documentJoinList() throws IOException {
		String memberId = req.getParameter("memberId");
		SearchAction searchAction = (SearchAction)Injector.getInstance().getObject(SearchAction.class);
		List<MemberContentVO> mcvoList = searchAction.memberContentSearchByMemberId(memberId);
		
		List<DocumentVO> dvoList = new ArrayList<DocumentVO>();
		for(int i=0;i<mcvoList.size();i++){
			dvoList.set(i, searchAction.documentSearch(mcvoList.get(i).getDocumentId()));
		}
		
		PrintWriter pw = res.getWriter();
		pw.write("documentJoinList");
		/*
		 * DocumentVO List 보내야함
		 */
		pw.flush();		
	}
	
	public void documentDelete() {
		String documentId = req.getParameter("docuemntId");
		
		DeleteAction deleteAction = (DeleteAction)Injector.getInstance().getObject(DeleteAction.class);
		deleteAction.documentDelete(documentId);
		deleteAction.contentDeleteByDocumentId(documentId);
		
		PrintWriter pw = res.getWriter();
		pw.write("documentDelete");
		/*
		 * DocumentVO List 보내야함
		 */
		pw.flush();
	}
	
	public void documentDeleteAll() {
		
	}
	
	public void contentCreate() throws IOException {
		ContentVO cvo = new ContentVO();
		cvo.setDocumentId(req.getParameter("documentId"));
		cvo.setContentId(req.getParameter("contentId"));
		cvo.setBody(req.getParameter("body"));
		cvo.setEditorId(req.getParameter("editorId"));
		
		AddAction addAction = (AddAction)Injector.getInstance().getObject(AddAction.class);		
		addAction.contentAdd(cvo);
		
		PrintWriter pw = res.getWriter();
		pw.write("contentCreate");
		/*
		 * DocumentVO List 보내야함
		 */
		pw.flush();
	}
	
	public void contentUpdate() throws IOException {
		ContentVO cvo = new ContentVO();
		cvo.setDocumentId(req.getParameter("documentId"));
		cvo.setContentId(req.getParameter("contentId"));
		cvo.setBody(req.getParameter("body"));
		cvo.setEditorId(req.getParameter("editorId"));
		
		ModifyAction modifyAction = (ModifyAction)Injector.getInstance().getObject(ModifyAction.class);
		modifyAction.contentModify(cvo);
		
		PrintWriter pw = res.getWriter();
		pw.write("contentUpdate");
		pw.flush();
	}
	
	public void contentRead() throws IOException {
		String contentId = req.getParameter("contentId");
		SearchAction searchAction = (SearchAction)Injector.getInstance().getObject(SearchAction.class);
		ContentVO cvo = searchAction.contentSearch(contentId);
		
		PrintWriter pw = res.getWriter();
		pw.write("contentRead");
		/*
		 * ContentVO 보내야함
		 */
		pw.flush();
	}
	
	public void contentReadAll() {
	
	}
	
	public void contentReadAllByKey() throws IOException {
		String documentId = req.getParameter("documentId");
		SearchAction searchAction = (SearchAction)Injector.getInstance().getObject(SearchAction.class);
		List<ContentVO> cvoList = searchAction.contentSearchByDocumentId(documentId);
		
		PrintWriter pw = res.getWriter();
		pw.write("contentReadAllByKey");
		/*
		 * ContentVO List 보내야함
		 */
		pw.flush();
	}
	
	public void contentDelete() throws IOException {
		String contentId = req.getParameter("contentId");
		
		DeleteAction deleteAction = (DeleteAction)Injector.getInstance().getObject(DeleteAction.class);
		deleteAction.contentDelete(contentId);
		
		PrintWriter pw = res.getWriter();
		pw.write("contentDelete");
		pw.flush();
	}
	
	public void contentDeleteAll() {
	
	}
	
	public void memberInvite() throws IOException {
		MemberContentVO mcvo = new MemberContentVO();
		mcvo.setDocumentId(req.getParameter("documnetId"));
		mcvo.setMemberId(req.getParameter("memberId"));
		mcvo.setMemberPosition(Integer.valueOf(req.getParameter("memberPosition")));

		AddAction addAction = (AddAction)Injector.getInstance().getObject(AddAction.class);		
		addAction.memberContentAdd(mcvo);
		
		PrintWriter pw = res.getWriter();
		pw.write("memberInvite");
		pw.flush();		
	}
	
	public void memberExpel() throws IOException {
		MemberContentVO mcvo = new MemberContentVO();
		mcvo.setDocumentId(req.getParameter("documnetId"));
		mcvo.setMemberId(req.getParameter("memberId"));
		mcvo.setMemberPosition(Integer.valueOf(req.getParameter("memberPosition")));
		
		DeleteAction deleteAction = (DeleteAction)Injector.getInstance().getObject(DeleteAction.class);
		deleteAction.memberContentDelete(mcvo);
		
		PrintWriter pw = res.getWriter();
		pw.write("memberExpel");
		pw.flush();				
	}
	
	public void memberPositionUpdate() throws IOException {
		MemberContentVO mcvo = new MemberContentVO();
		mcvo.setDocumentId(req.getParameter("documnetId"));
		mcvo.setMemberId(req.getParameter("memberId"));
		mcvo.setMemberPosition(Integer.valueOf(req.getParameter("memberPosition")));
		
		ModifyAction modifyAction = (ModifyAction)Injector.getInstance().getObject(ModifyAction.class);
		modifyAction.memberContentModify(mcvo);

		PrintWriter pw = res.getWriter();
		pw.write("memberPositionUpdate");
		pw.flush();
	}
}

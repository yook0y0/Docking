package org.docking.erbse.controller;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.docking.erbse.dao.service.GenericService;
import org.docking.erbse.dao.serviceImpl.GenericServiceImpl;
import org.docking.erbse.service.DockingService;
import org.docking.erbse.util.Injector;
import org.docking.erbse.view.ContentsView;
import org.docking.erbse.vo.ContentVO;

import org.docking.erbse.vo.MemberVO;
import org.docking.erbse.vo.EditorExecuteInfoVO;


public class DockingController {
	private HttpServletRequest req;
	private HttpServletResponse res;

	private DockingService ds;

	public DockingController(){
		this.req = null;
		this.res = null;
		this.ds = (DockingService)Injector.getInstance().getObject(DockingService.class);
	}

	public void setReq(HttpServletRequest req) {
		this.req = req;
	}
	public void setRes(HttpServletResponse res) {
		this.res = res;
	}

	public void editorTestExecute() throws IOException{
		String editorId = req.getParameter("editorId");
		
		EditorExecuteInfoVO eeivo = ds.editorTestExecute(editorId);
		req.setAttribute("eeivo", eeivo);
		
		try {
			req.getRequestDispatcher("./test.jsp").forward(req, res);
		} catch (ServletException e) {
			// TODO Auto-generated catch block
			System.out.println("error");
		}
		/*PrintWriter pw = res.getWriter();
		pw.write(jRes);
		pw.flush();*/
	}

	public void editorExecute() throws IOException, ServletException
	{
		String contentId = req.getParameter("contentId");
		
		GenericService<ContentVO>	service = new GenericServiceImpl<ContentVO>();
		ContentVO	cvo = service.search("content_search", contentId);
		
		GenericService<EditorExecuteInfoVO> eeivoService = new GenericServiceImpl<EditorExecuteInfoVO>();
		EditorExecuteInfoVO eeivo = eeivoService.search("editorExecute_search", cvo.getEditorId());
		
		List<ContentVO>	contentList = service.searchAll("content_searchAll_key", cvo.getDocumentId());
		List<ContentsView>	contentsViewList = new ArrayList<ContentsView>();
		
		ContentsView	cv;
		
		for(ContentVO conVO : contentList)
		{
			cv = new ContentsView();
			
			cv.setEditorId(conVO.getEditorId());
			cv.setStartPage((eeivoService.search("editorExecute_search", conVO.getEditorId())).getStartPage());
			
			contentsViewList.add(cv);
		}
		
		req.setAttribute("getMethod", eeivo.getGetMethod());
		req.setAttribute("setMethod", eeivo.getSetMethod());
		req.setAttribute("startPage", eeivo.getStartPage());
		req.setAttribute("editorId", eeivo.getEditorId());

		System.out.println("eeivo.getGetMethod()" + eeivo.getGetMethod());
		System.out.println("eeivo.getSetMethod()" + eeivo.getSetMethod());
		System.out.println("eeivo.getStartPage()" + eeivo.getStartPage());
		
		req.setAttribute("contentId", contentId);
		req.setAttribute("documentId", cvo.getDocumentId());
		req.setAttribute("memberId", ((MemberVO)req.getSession().getAttribute("logInMember")).getMemberId());
		req.setAttribute("contentsViewList", contentsViewList);
		req.setAttribute("contentCount", contentList.size());
		
		req.getRequestDispatcher("./docking.jsp").forward(req, res);
	}

	public void getEditorCode() throws IOException{
		String editorId = req.getParameter("editorId");
		String path = req.getParameter("path");
		String code = ds.getEditorCode(editorId,path);

		PrintWriter pw = res.getWriter();
		pw.write(code);
		pw.flush();
	}
}

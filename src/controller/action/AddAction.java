package controller.action;

import java.io.IOException;
import java.io.Reader;

import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;

import com.ibatis.common.resources.Resources;

import service.GenericService;
import serviceImpl.GenericServiceImpl;
import vo.DocumentVO;
import vo.EditorCodeVO;
import vo.EditorReviewVO;
import vo.EditorVO;
import vo.MemberContentsVO;
import vo.MemberVO;
import vo.TempVO;

public class AddAction {
	
	public void addDocument(DocumentVO vo){
		GenericService<DocumentVO>	s = new GenericServiceImpl<DocumentVO>();
		s.add("document_add", vo);
	}
	
	public void addEditorCode(EditorCodeVO vo){
		GenericService<EditorCodeVO>	s = new GenericServiceImpl<EditorCodeVO>();
		s.add("editorCode_add", vo);
	}

	public void addEditor(EditorVO vo){
		GenericService<EditorVO>	s = new GenericServiceImpl<EditorVO>();
		s.add("editor_add", vo);
	}
	
	public void addEditorReview(EditorReviewVO vo){
		GenericService<EditorReviewVO>	s = new GenericServiceImpl<EditorReviewVO>();
		s.add("editorReview_add", vo);
	}
	
	public void addMember(MemberVO vo){
		GenericService<MemberVO>	s = new GenericServiceImpl<MemberVO>();
		s.add("member_add", vo);		
	}
	
	public void addMemberContents(MemberContentsVO vo){
		GenericService<MemberContentsVO>	s = new GenericServiceImpl<MemberContentsVO>();
		s.add("memberContents_add", vo);
	}
	
	public void addTemp(TempVO vo){
		GenericService<TempVO>	s = new GenericServiceImpl<TempVO>();
		s.add("temp_add", vo);
	}
	
	/*
	 *  ......
	 */
	SqlSession	sqlSession = null;
	public void	tempConnect()
	{
		String resource = "mybatis-config.xml";
		Reader reader = null;
		sqlSession = null;
		SqlSessionFactory	sqlMapper = null;
		
		try 
		{
			reader = Resources.getResourceAsReader(resource);

			sqlMapper = new SqlSessionFactoryBuilder().build(reader);
			
			sqlSession = sqlMapper.openSession();
		} 
		
		catch (IOException e) 
		{
			e.printStackTrace();
		}
	}
	
	public void tempAdd(EditorCodeVO editorCodeVO)
	{
		sqlSession.selectList("editorCode_add", editorCodeVO);
	}
	
	public void tempDisConnect()
	{
		sqlSession.close();
	}
}
